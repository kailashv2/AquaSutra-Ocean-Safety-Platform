const db = require('../config/db');
const socialMediaService = require('../services/socialMediaService');
const multilingualService = require('../services/multilingualService');

// Get social media posts with filtering
exports.getSocialMediaPosts = async (req, res, next) => {
  try {
    const {
      platform,
      hazardRelated = true,
      sentiment,
      location,
      radius = 50000,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      language = 'en'
    } = req.query;

    const filters = {
      platform,
      hazardRelated: hazardRelated === 'true',
      sentiment,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    if (location) {
      filters.location = JSON.parse(location);
      filters.radius = parseInt(radius);
    }

    const posts = await socialMediaService.getPosts(filters);

    // Localize content if needed
    const localizedPosts = posts.map(post => ({
      ...post,
      sentiment_label_localized: multilingualService.translate(
        `sentiment.${post.sentiment_label}`, 
        language, 
        post.sentiment_label
      ),
      platform_name: multilingualService.translate(
        `platform.${post.platform}`, 
        language, 
        post.platform
      )
    }));

    res.json({
      posts: localizedPosts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: localizedPosts.length
      },
      filters
    });
  } catch (error) {
    next(error);
  }
};

// Get social media posts near a specific location
exports.getNearbyPosts = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25000, limit = 100 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const result = await db.query(`
      SELECT 
        id, platform, content, author_username, author_name,
        ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat,
        location_name, sentiment_score, sentiment_label, keywords,
        hazard_relevance_score, is_hazard_related, engagement_metrics,
        post_created_at, created_at,
        ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance
      FROM social_media_posts
      WHERE location IS NOT NULL
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      AND is_hazard_related = true
      ORDER BY distance ASC, post_created_at DESC
      LIMIT $4
    `, [parseFloat(lng), parseFloat(lat), parseInt(radius), parseInt(limit)]);

    const posts = result.rows.map(row => ({
      id: row.id,
      platform: row.platform,
      content: row.content,
      author: {
        username: row.author_username,
        name: row.author_name
      },
      location: {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        name: row.location_name
      },
      sentiment: {
        score: row.sentiment_score,
        label: row.sentiment_label
      },
      keywords: row.keywords,
      hazardRelevanceScore: row.hazard_relevance_score,
      isHazardRelated: row.is_hazard_related,
      engagementMetrics: row.engagement_metrics,
      distance: parseInt(row.distance),
      postCreatedAt: row.post_created_at,
      createdAt: row.created_at
    }));

    res.json({
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseInt(radius),
      posts,
      count: posts.length
    });
  } catch (error) {
    next(error);
  }
};

// Get trending hazard-related posts
exports.getTrendingPosts = async (req, res, next) => {
  try {
    const { 
      timeframe = '24h',
      platform,
      minEngagement = 10,
      limit = 50
    } = req.query;

    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    let query = `
      SELECT 
        id, platform, content, author_username, author_name,
        ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat,
        location_name, sentiment_score, sentiment_label, keywords,
        hazard_relevance_score, engagement_metrics, post_created_at,
        (
          COALESCE((engagement_metrics->>'retweet_count')::int, 0) +
          COALESCE((engagement_metrics->>'like_count')::int, 0) +
          COALESCE((engagement_metrics->>'reply_count')::int, 0) +
          COALESCE((engagement_metrics->>'reactions')::int, 0) +
          COALESCE((engagement_metrics->>'comments')::int, 0) +
          COALESCE((engagement_metrics->>'shares')::int, 0)
        ) as total_engagement
      FROM social_media_posts
      WHERE post_created_at >= NOW() - INTERVAL '${interval}'
      AND is_hazard_related = true
    `;

    const params = [];
    let paramIndex = 1;

    if (platform) {
      query += ` AND platform = $${paramIndex}`;
      params.push(platform);
      paramIndex++;
    }

    query += `
      HAVING (
        COALESCE((engagement_metrics->>'retweet_count')::int, 0) +
        COALESCE((engagement_metrics->>'like_count')::int, 0) +
        COALESCE((engagement_metrics->>'reply_count')::int, 0) +
        COALESCE((engagement_metrics->>'reactions')::int, 0) +
        COALESCE((engagement_metrics->>'comments')::int, 0) +
        COALESCE((engagement_metrics->>'shares')::int, 0)
      ) >= $${paramIndex}
      ORDER BY total_engagement DESC, hazard_relevance_score DESC
      LIMIT $${paramIndex + 1}
    `;

    params.push(parseInt(minEngagement), parseInt(limit));

    const result = await db.query(query, params);

    const trendingPosts = result.rows.map(row => ({
      id: row.id,
      platform: row.platform,
      content: row.content,
      author: {
        username: row.author_username,
        name: row.author_name
      },
      location: row.lng && row.lat ? {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        name: row.location_name
      } : null,
      sentiment: {
        score: row.sentiment_score,
        label: row.sentiment_label
      },
      keywords: row.keywords,
      hazardRelevanceScore: row.hazard_relevance_score,
      engagementMetrics: row.engagement_metrics,
      totalEngagement: parseInt(row.total_engagement),
      postCreatedAt: row.post_created_at
    }));

    res.json({
      timeframe,
      platform,
      minEngagement: parseInt(minEngagement),
      posts: trendingPosts,
      count: trendingPosts.length
    });
  } catch (error) {
    next(error);
  }
};

// Get sentiment analysis summary
exports.getSentimentAnalysis = async (req, res, next) => {
  try {
    const { 
      timeframe = '24h',
      platform,
      location,
      radius = 100000,
      hazardType
    } = req.query;

    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    let query = `
      SELECT 
        sentiment_label,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score,
        AVG(hazard_relevance_score) as avg_relevance,
        platform
      FROM social_media_posts
      WHERE post_created_at >= NOW() - INTERVAL '${interval}'
      AND is_hazard_related = true
    `;

    const params = [];
    let paramIndex = 1;

    if (platform) {
      query += ` AND platform = $${paramIndex}`;
      params.push(platform);
      paramIndex++;
    }

    if (location && radius) {
      const { lat, lng } = JSON.parse(location);
      query += ` AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex+1}), 4326)::geography,
        $${paramIndex+2}
      )`;
      params.push(lng, lat, parseInt(radius));
      paramIndex += 3;
    }

    if (hazardType) {
      query += ` AND keywords @> $${paramIndex}`;
      params.push(JSON.stringify([hazardType]));
      paramIndex++;
    }

    query += `
      GROUP BY sentiment_label, platform
      ORDER BY platform, count DESC
    `;

    const result = await db.query(query, params);

    // Get temporal sentiment trends
    const trendsQuery = `
      SELECT 
        DATE_TRUNC('hour', post_created_at) as time_bucket,
        sentiment_label,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score
      FROM social_media_posts
      WHERE post_created_at >= NOW() - INTERVAL '${interval}'
      AND is_hazard_related = true
      ${platform ? `AND platform = '${platform}'` : ''}
      GROUP BY DATE_TRUNC('hour', post_created_at), sentiment_label
      ORDER BY time_bucket
    `;

    const trendsResult = await db.query(trendsQuery);

    res.json({
      timeframe,
      platform,
      summary: result.rows.map(row => ({
        sentiment: row.sentiment_label,
        count: parseInt(row.count),
        avgScore: parseFloat(row.avg_score),
        avgRelevance: parseFloat(row.avg_relevance),
        platform: row.platform
      })),
      trends: trendsResult.rows.map(row => ({
        time: row.time_bucket,
        sentiment: row.sentiment_label,
        count: parseInt(row.count),
        avgScore: parseFloat(row.avg_score)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get trending keywords
exports.getTrendingKeywords = async (req, res, next) => {
  try {
    const { timeframe = '24h', limit = 20, minFrequency = 3 } = req.query;

    const keywords = await socialMediaService.getTrendingKeywords(timeframe);
    
    const filteredKeywords = keywords
      .filter(keyword => keyword.frequency >= parseInt(minFrequency))
      .slice(0, parseInt(limit));

    res.json({
      timeframe,
      keywords: filteredKeywords,
      count: filteredKeywords.length
    });
  } catch (error) {
    next(error);
  }
};

// Set up monitoring for specific keywords or locations
exports.setupMonitoring = async (req, res, next) => {
  try {
    // Check permissions
    if (!req.user || !['analyst', 'administrator', 'official'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const {
      keywords = [],
      location,
      radius = 50000,
      platforms = ['twitter', 'facebook'],
      alertThreshold = 0.7
    } = req.body;

    // Create monitoring configuration
    const monitoringConfig = {
      id: require('uuid').v4(),
      userId: req.user.id,
      keywords,
      location,
      radius: parseInt(radius),
      platforms,
      alertThreshold: parseFloat(alertThreshold),
      isActive: true,
      createdAt: new Date()
    };

    // Save to database
    await db.query(`
      INSERT INTO social_monitoring_configs (
        id, user_id, keywords, location, radius, platforms, 
        alert_threshold, is_active, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      monitoringConfig.id,
      monitoringConfig.userId,
      JSON.stringify(monitoringConfig.keywords),
      monitoringConfig.location ? `POINT(${monitoringConfig.location.lng} ${monitoringConfig.location.lat})` : null,
      monitoringConfig.radius,
      JSON.stringify(monitoringConfig.platforms),
      monitoringConfig.alertThreshold,
      monitoringConfig.isActive,
      monitoringConfig.createdAt
    ]);

    res.status(201).json({
      message: 'Social media monitoring configured successfully',
      config: monitoringConfig
    });
  } catch (error) {
    next(error);
  }
};

// Get social media alerts
exports.getSocialMediaAlerts = async (req, res, next) => {
  try {
    const { 
      timeframe = '24h',
      severity = 'all',
      status = 'all',
      limit = 50 
    } = req.query;

    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    let query = `
      SELECT 
        smp.id, smp.platform, smp.content, smp.author_username,
        ST_X(smp.location::geometry) as lng, ST_Y(smp.location::geometry) as lat,
        smp.sentiment_score, smp.sentiment_label, smp.keywords,
        smp.hazard_relevance_score, smp.engagement_metrics, smp.post_created_at,
        CASE 
          WHEN smp.hazard_relevance_score >= 0.8 THEN 'high'
          WHEN smp.hazard_relevance_score >= 0.6 THEN 'medium'
          ELSE 'low'
        END as alert_severity
      FROM social_media_posts smp
      WHERE smp.post_created_at >= NOW() - INTERVAL '${interval}'
      AND smp.is_hazard_related = true
      AND smp.hazard_relevance_score >= 0.6
    `;

    const params = [];
    let paramIndex = 1;

    if (severity !== 'all') {
      if (severity === 'high') {
        query += ` AND smp.hazard_relevance_score >= 0.8`;
      } else if (severity === 'medium') {
        query += ` AND smp.hazard_relevance_score >= 0.6 AND smp.hazard_relevance_score < 0.8`;
      } else if (severity === 'low') {
        query += ` AND smp.hazard_relevance_score < 0.6`;
      }
    }

    query += `
      ORDER BY smp.hazard_relevance_score DESC, smp.post_created_at DESC
      LIMIT $${paramIndex}
    `;

    params.push(parseInt(limit));

    const result = await db.query(query, params);

    const alerts = result.rows.map(row => ({
      id: row.id,
      platform: row.platform,
      content: row.content,
      author: row.author_username,
      location: row.lng && row.lat ? {
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng)
      } : null,
      sentiment: {
        score: row.sentiment_score,
        label: row.sentiment_label
      },
      keywords: row.keywords,
      hazardRelevanceScore: row.hazard_relevance_score,
      alertSeverity: row.alert_severity,
      engagementMetrics: row.engagement_metrics,
      postCreatedAt: row.post_created_at
    }));

    res.json({
      timeframe,
      severity,
      alerts,
      count: alerts.length
    });
  } catch (error) {
    next(error);
  }
};

// Get platform engagement metrics
exports.getPlatformMetrics = async (req, res, next) => {
  try {
    const { timeframe = '7d' } = req.query;

    const intervalMap = {
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[timeframe] || '7 days';

    const result = await db.query(`
      SELECT 
        platform,
        COUNT(*) as total_posts,
        COUNT(CASE WHEN is_hazard_related = true THEN 1 END) as hazard_posts,
        AVG(sentiment_score) as avg_sentiment,
        AVG(hazard_relevance_score) as avg_relevance,
        SUM(
          COALESCE((engagement_metrics->>'retweet_count')::int, 0) +
          COALESCE((engagement_metrics->>'like_count')::int, 0) +
          COALESCE((engagement_metrics->>'reply_count')::int, 0) +
          COALESCE((engagement_metrics->>'reactions')::int, 0) +
          COALESCE((engagement_metrics->>'comments')::int, 0) +
          COALESCE((engagement_metrics->>'shares')::int, 0)
        ) as total_engagement
      FROM social_media_posts
      WHERE post_created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY platform
      ORDER BY hazard_posts DESC
    `);

    const metrics = result.rows.map(row => ({
      platform: row.platform,
      totalPosts: parseInt(row.total_posts),
      hazardPosts: parseInt(row.hazard_posts),
      hazardPostsPercentage: row.total_posts > 0 ? 
        (row.hazard_posts / row.total_posts * 100).toFixed(2) : 0,
      avgSentiment: parseFloat(row.avg_sentiment || 0),
      avgRelevance: parseFloat(row.avg_relevance || 0),
      totalEngagement: parseInt(row.total_engagement || 0)
    }));

    res.json({
      timeframe,
      platforms: metrics,
      summary: {
        totalPlatforms: metrics.length,
        totalPosts: metrics.reduce((sum, m) => sum + m.totalPosts, 0),
        totalHazardPosts: metrics.reduce((sum, m) => sum + m.hazardPosts, 0),
        totalEngagement: metrics.reduce((sum, m) => sum + m.totalEngagement, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
