const db = require('../config/db');
const hotspotService = require('../services/hotspotService');

// Get active hotspots with filtering
exports.getActiveHotspots = async (req, res, next) => {
  try {
    const {
      minIntensity,
      hazardType,
      location,
      searchRadius = 100000,
      limit = 50
    } = req.query;

    const filters = {
      minIntensity: minIntensity ? parseFloat(minIntensity) : undefined,
      hazardType,
      limit: parseInt(limit)
    };

    if (location) {
      filters.location = JSON.parse(location);
      filters.searchRadius = parseInt(searchRadius);
    }

    const hotspots = await hotspotService.getActiveHotspots(filters);

    res.json({
      hotspots,
      count: hotspots.length,
      filters
    });
  } catch (error) {
    next(error);
  }
};

// Generate hotspots manually
exports.generateHotspots = async (req, res, next) => {
  try {
    // Check permissions
    if (!req.user || !['analyst', 'administrator', 'official'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const hotspotsCreated = await hotspotService.generateHotspots();

    res.json({
      message: 'Hotspots generated successfully',
      hotspotsCreated,
      generatedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get hotspot details by ID
exports.getHotspotById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        h.id,
        ST_X(h.location::geometry) as lng,
        ST_Y(h.location::geometry) as lat,
        h.radius,
        h.intensity_score,
        h.report_count,
        h.social_media_count,
        h.hazard_types,
        h.severity_distribution,
        h.last_activity,
        h.created_at,
        h.updated_at
      FROM hotspots h
      WHERE h.id = $1 AND h.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotspot not found' });
    }

    const hotspot = result.rows[0];

    // Get related reports
    const reportsResult = await db.query(`
      SELECT 
        r.id, r.hazard_type, r.severity, r.verification_status,
        ST_X(r.location::geometry) as lng, ST_Y(r.location::geometry) as lat,
        r.note, r.created_at, u.name as reporter_name
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE ST_DWithin(
        r.location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      AND r.created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY r.created_at DESC
      LIMIT 20
    `, [hotspot.lng, hotspot.lat, hotspot.radius]);

    // Get related social media posts
    const socialResult = await db.query(`
      SELECT 
        s.id, s.platform, s.content, s.author_username,
        ST_X(s.location::geometry) as lng, ST_Y(s.location::geometry) as lat,
        s.sentiment_score, s.sentiment_label, s.hazard_relevance_score,
        s.post_created_at
      FROM social_media_posts s
      WHERE s.location IS NOT NULL
      AND ST_DWithin(
        s.location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      AND s.is_hazard_related = true
      AND s.post_created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY s.hazard_relevance_score DESC, s.post_created_at DESC
      LIMIT 10
    `, [hotspot.lng, hotspot.lat, hotspot.radius]);

    const hotspotDetails = {
      id: hotspot.id,
      location: {
        lat: parseFloat(hotspot.lat),
        lng: parseFloat(hotspot.lng)
      },
      radius: hotspot.radius,
      intensityScore: hotspot.intensity_score,
      reportCount: hotspot.report_count,
      socialMediaCount: hotspot.social_media_count,
      hazardTypes: hotspot.hazard_types,
      severityDistribution: hotspot.severity_distribution,
      lastActivity: hotspot.last_activity,
      createdAt: hotspot.created_at,
      updatedAt: hotspot.updated_at,
      relatedReports: reportsResult.rows.map(row => ({
        id: row.id,
        hazardType: row.hazard_type,
        severity: row.severity,
        verificationStatus: row.verification_status,
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        },
        note: row.note,
        createdAt: row.created_at,
        reporterName: row.reporter_name
      })),
      relatedSocialPosts: socialResult.rows.map(row => ({
        id: row.id,
        platform: row.platform,
        content: row.content.substring(0, 200) + (row.content.length > 200 ? '...' : ''),
        author: row.author_username,
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        },
        sentiment: {
          score: row.sentiment_score,
          label: row.sentiment_label
        },
        hazardRelevanceScore: row.hazard_relevance_score,
        postCreatedAt: row.post_created_at
      }))
    };

    res.json(hotspotDetails);
  } catch (error) {
    next(error);
  }
};

// Get hotspot statistics
exports.getHotspotStatistics = async (req, res, next) => {
  try {
    const { timeframe = '24h' } = req.query;

    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    const stats = await hotspotService.getHotspotStatistics();

    // Get temporal trends
    const trendsResult = await db.query(`
      SELECT 
        DATE_TRUNC('hour', created_at) as time_bucket,
        COUNT(*) as hotspots_created,
        AVG(intensity_score) as avg_intensity
      FROM hotspots
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY time_bucket
    `);

    // Get geographic distribution
    const geoResult = await db.query(`
      SELECT 
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat,
        intensity_score,
        report_count,
        social_media_count,
        hazard_types
      FROM hotspots
      WHERE is_active = true
      AND last_activity >= NOW() - INTERVAL '${interval}'
      ORDER BY intensity_score DESC
      LIMIT 100
    `);

    res.json({
      timeframe,
      summary: stats,
      trends: trendsResult.rows.map(row => ({
        time: row.time_bucket,
        hotspotsCreated: parseInt(row.hotspots_created),
        avgIntensity: parseFloat(row.avg_intensity || 0)
      })),
      geographic: geoResult.rows.map(row => ({
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        },
        intensityScore: row.intensity_score,
        reportCount: row.report_count,
        socialMediaCount: row.social_media_count,
        hazardTypes: row.hazard_types
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Update hotspot settings
exports.updateHotspotSettings = async (req, res, next) => {
  try {
    // Check permissions
    if (!req.user || !['administrator', 'analyst'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const {
      minReports = 3,
      radiusKm = 5,
      decayHours = 24,
      socialMediaWeight = 0.3,
      reportWeight = 0.7
    } = req.body;

    const newSettings = {
      minReports: parseInt(minReports),
      radiusKm: parseFloat(radiusKm),
      decayHours: parseInt(decayHours),
      socialMediaWeight: parseFloat(socialMediaWeight),
      reportWeight: parseFloat(reportWeight)
    };

    // Validate settings
    if (newSettings.minReports < 1 || newSettings.minReports > 20) {
      return res.status(400).json({ message: 'minReports must be between 1 and 20' });
    }

    if (newSettings.radiusKm < 1 || newSettings.radiusKm > 100) {
      return res.status(400).json({ message: 'radiusKm must be between 1 and 100' });
    }

    if (newSettings.decayHours < 1 || newSettings.decayHours > 168) {
      return res.status(400).json({ message: 'decayHours must be between 1 and 168 (1 week)' });
    }

    if (newSettings.socialMediaWeight + newSettings.reportWeight !== 1.0) {
      return res.status(400).json({ message: 'socialMediaWeight and reportWeight must sum to 1.0' });
    }

    const updatedSettings = await hotspotService.updateSettings(newSettings);

    res.json({
      message: 'Hotspot settings updated successfully',
      settings: updatedSettings,
      updatedBy: req.user.id,
      updatedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get hotspots within bounds
exports.getHotspotsInBounds = async (req, res, next) => {
  try {
    const { bounds, minIntensity = 0 } = req.query;

    if (!bounds) {
      return res.status(400).json({ message: 'Bounds parameter is required' });
    }

    const { north, south, east, west } = JSON.parse(bounds);

    const result = await db.query(`
      SELECT 
        h.id,
        ST_X(h.location::geometry) as lng,
        ST_Y(h.location::geometry) as lat,
        h.radius,
        h.intensity_score,
        h.report_count,
        h.social_media_count,
        h.hazard_types,
        h.severity_distribution,
        h.last_activity
      FROM hotspots h
      WHERE h.is_active = true
      AND h.intensity_score >= $1
      AND ST_Within(
        h.location::geometry,
        ST_MakeEnvelope($2, $3, $4, $5, 4326)
      )
      ORDER BY h.intensity_score DESC
    `, [parseFloat(minIntensity), west, south, east, north]);

    const hotspots = result.rows.map(row => ({
      id: row.id,
      location: {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng)
      },
      radius: row.radius,
      intensityScore: row.intensity_score,
      reportCount: row.report_count,
      socialMediaCount: row.social_media_count,
      hazardTypes: row.hazard_types,
      severityDistribution: row.severity_distribution,
      lastActivity: row.last_activity
    }));

    res.json({
      bounds: { north, south, east, west },
      minIntensity: parseFloat(minIntensity),
      hotspots,
      count: hotspots.length
    });
  } catch (error) {
    next(error);
  }
};

// Get hotspot history
exports.getHotspotHistory = async (req, res, next) => {
  try {
    const { timeframe = '7d', limit = 100 } = req.query;

    const intervalMap = {
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days',
      '90d': '90 days'
    };
    const interval = intervalMap[timeframe] || '7 days';

    const result = await db.query(`
      SELECT 
        h.id,
        ST_X(h.location::geometry) as lng,
        ST_Y(h.location::geometry) as lat,
        h.radius,
        h.intensity_score,
        h.report_count,
        h.social_media_count,
        h.hazard_types,
        h.severity_distribution,
        h.last_activity,
        h.created_at,
        h.updated_at,
        h.is_active
      FROM hotspots h
      WHERE h.created_at >= NOW() - INTERVAL '${interval}'
      ORDER BY h.created_at DESC
      LIMIT $1
    `, [parseInt(limit)]);

    const hotspots = result.rows.map(row => ({
      id: row.id,
      location: {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng)
      },
      radius: row.radius,
      intensityScore: row.intensity_score,
      reportCount: row.report_count,
      socialMediaCount: row.social_media_count,
      hazardTypes: row.hazard_types,
      severityDistribution: row.severity_distribution,
      lastActivity: row.last_activity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active
    }));

    // Get summary statistics
    const activeCount = hotspots.filter(h => h.isActive).length;
    const inactiveCount = hotspots.length - activeCount;
    const avgIntensity = hotspots.reduce((sum, h) => sum + h.intensityScore, 0) / hotspots.length;

    res.json({
      timeframe,
      hotspots,
      summary: {
        total: hotspots.length,
        active: activeCount,
        inactive: inactiveCount,
        avgIntensity: avgIntensity || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete inactive hotspots
exports.cleanupHotspots = async (req, res, next) => {
  try {
    // Check permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    const { olderThan = '7d' } = req.query;

    const intervalMap = {
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[olderThan] || '7 days';

    const result = await db.query(`
      DELETE FROM hotspots
      WHERE is_active = false
      AND updated_at < NOW() - INTERVAL '${interval}'
    `);

    res.json({
      message: 'Hotspot cleanup completed',
      deletedCount: result.rowCount,
      olderThan,
      cleanedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
