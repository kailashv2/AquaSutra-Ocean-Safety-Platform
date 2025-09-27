const db = require('../config/db');
const hotspotService = require('../services/hotspotService');
const socialMediaService = require('../services/socialMediaService');
const multilingualService = require('../services/multilingualService');

// Get comprehensive dashboard data
exports.getDashboardData = async (req, res, next) => {
  try {
    const { timeframe = '24h', language = 'en' } = req.query;
    
    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days',
      '90d': '90 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    // Get report statistics
    const reportStats = await db.query(`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_reports,
        COUNT(CASE WHEN verification_status = 'unverified' THEN 1 END) as unverified_reports,
        COUNT(CASE WHEN is_emergency = true THEN 1 END) as emergency_reports,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '${interval}' THEN 1 END) as recent_reports
      FROM reports
      WHERE created_at >= NOW() - INTERVAL '${interval}'
    `);

    // Get hazard type distribution
    const hazardDistribution = await db.query(`
      SELECT 
        hazard_type,
        COUNT(*) as count,
        AVG(CASE 
          WHEN severity = 'low' THEN 1
          WHEN severity = 'medium' THEN 2
          WHEN severity = 'high' THEN 3
          WHEN severity = 'critical' THEN 4
          ELSE 2
        END) as avg_severity
      FROM reports
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY hazard_type
      ORDER BY count DESC
    `);

    // Get active hotspots
    const activeHotspots = await hotspotService.getActiveHotspots({ limit: 20 });

    // Get social media statistics
    const socialStats = await db.query(`
      SELECT 
        platform,
        COUNT(*) as post_count,
        AVG(sentiment_score) as avg_sentiment,
        COUNT(CASE WHEN is_hazard_related = true THEN 1 END) as hazard_related_count
      FROM social_media_posts
      WHERE post_created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY platform
      ORDER BY post_count DESC
    `);

    // Get trending keywords
    const trendingKeywords = await socialMediaService.getTrendingKeywords(interval);

    // Localize hazard types if language is not English
    const localizedHazardDistribution = hazardDistribution.rows.map(row => ({
      ...row,
      hazard_type_localized: multilingualService.translate(`hazard.${row.hazard_type}`, language, row.hazard_type),
      count: parseInt(row.count),
      avg_severity: parseFloat(row.avg_severity)
    }));

    const dashboardData = {
      summary: {
        totalReports: parseInt(reportStats.rows[0].total_reports),
        verifiedReports: parseInt(reportStats.rows[0].verified_reports),
        unverifiedReports: parseInt(reportStats.rows[0].unverified_reports),
        emergencyReports: parseInt(reportStats.rows[0].emergency_reports),
        recentReports: parseInt(reportStats.rows[0].recent_reports)
      },
      hazardDistribution: localizedHazardDistribution,
      activeHotspots,
      socialMedia: {
        platforms: socialStats.rows.map(row => ({
          platform: row.platform,
          postCount: parseInt(row.post_count),
          avgSentiment: parseFloat(row.avg_sentiment || 0),
          hazardRelatedCount: parseInt(row.hazard_related_count)
        })),
        trendingKeywords
      },
      timeframe,
      generatedAt: new Date()
    };

    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
};

// Get verification statistics
exports.getVerificationStats = async (req, res, next) => {
  try {
    const { timeframe = '30d', userRole } = req.query;
    
    const intervalMap = {
      '7d': '7 days',
      '30d': '30 days',
      '90d': '90 days'
    };
    const interval = intervalMap[timeframe] || '30 days';

    let query = `
      SELECT 
        r.verification_status,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (r.verified_at - r.created_at))/3600) as avg_verification_time_hours,
        u.role as verifier_role
      FROM reports r
      LEFT JOIN users u ON r.verified_by = u.id
      WHERE r.created_at >= NOW() - INTERVAL '${interval}'
    `;

    const params = [];
    let paramIndex = 1;

    if (userRole) {
      query += ` AND u.role = $${paramIndex}`;
      params.push(userRole);
      paramIndex++;
    }

    query += `
      GROUP BY r.verification_status, u.role
      ORDER BY count DESC
    `;

    const result = await db.query(query, params);

    res.json({
      timeframe,
      summary: result.rows.map(row => ({
        status: row.verification_status,
        count: parseInt(row.count),
        avgVerificationTime: parseFloat(row.avg_verification_time_hours || 0),
        verifierRole: row.verifier_role
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get geographic insights
exports.getGeographicInsights = async (req, res, next) => {
  try {
    const { bounds, timeframe = '30d' } = req.query;

    const intervalMap = {
      '7d': '7 days',
      '30d': '30 days',
      '90d': '90 days'
    };
    const interval = intervalMap[timeframe] || '30 days';

    let query = `
      SELECT 
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        hazard_type,
        severity,
        verification_status,
        created_at
      FROM reports
      WHERE created_at >= NOW() - INTERVAL '${interval}'
    `;

    const params = [];
    let paramIndex = 1;

    if (bounds) {
      const { north, south, east, west } = JSON.parse(bounds);
      query += ` AND ST_Within(
        location::geometry,
        ST_MakeEnvelope($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, 4326)
      )`;
      params.push(west, south, east, north);
      paramIndex += 4;
    }

    query += ` ORDER BY created_at DESC LIMIT 1000`;

    const result = await db.query(query, params);

    res.json({
      timeframe,
      data: result.rows.map(row => ({
        location: { lat: parseFloat(row.lat), lng: parseFloat(row.lng) },
        hazardType: row.hazard_type,
        severity: row.severity,
        verificationStatus: row.verification_status,
        timestamp: row.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Export data for analysis
exports.exportData = async (req, res, next) => {
  try {
    const { format = 'json', timeframe = '30d' } = req.query;

    // Check permissions for data export
    if (!req.user || !['analyst', 'administrator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions for data export' });
    }

    const intervalMap = {
      '7d': '7 days',
      '30d': '30 days',
      '90d': '90 days',
      '1y': '1 year'
    };
    const interval = intervalMap[timeframe] || '30 days';

    const reportsQuery = `
      SELECT 
        r.id, r.hazard_type, r.severity, r.verification_status,
        ST_X(r.location::geometry) as lng, ST_Y(r.location::geometry) as lat,
        r.note, r.tags, r.metadata, r.created_at, r.updated_at
      FROM reports r
      WHERE r.created_at >= NOW() - INTERVAL '${interval}'
      ORDER BY r.created_at DESC
    `;

    const reportsResult = await db.query(reportsQuery);
    const exportData = { reports: reportsResult.rows };

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData.reports);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="aquasutra_export_${timeframe}.csv"`);
      res.send(csv);
    } else {
      res.json(exportData);
    }
  } catch (error) {
    next(error);
  }
};

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

module.exports = exports;
