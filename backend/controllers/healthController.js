const serviceManager = require('../services/serviceManager');
const db = require('../config/db');

// Get system health status
exports.getHealthStatus = async (req, res, next) => {
  try {
    const healthCheck = await serviceManager.getHealthCheck();
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

// Get detailed service status (admin only)
exports.getServiceStatus = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    const status = await serviceManager.getServiceStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
};

// Restart a specific service (admin only)
exports.restartService = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    const { serviceName } = req.params;
    
    if (!serviceName) {
      return res.status(400).json({ message: 'Service name is required' });
    }

    await serviceManager.restartService(serviceName);
    
    res.json({
      message: `Service '${serviceName}' restarted successfully`,
      serviceName,
      restartedBy: req.user.id,
      restartedAt: new Date()
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('cannot be restarted')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get system metrics
exports.getSystemMetrics = async (req, res, next) => {
  try {
    // Check permissions
    if (!req.user || !['administrator', 'analyst'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const metrics = {
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      database: {
        connected: false,
        connectionCount: 0,
        queryStats: null
      },
      application: {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        version: process.env.npm_package_version || '1.0.0'
      }
    };

    // Test database connection and get stats
    try {
      await db.query('SELECT 1');
      metrics.database.connected = true;

      // Get connection count (PostgreSQL specific)
      const connResult = await db.query(`
        SELECT count(*) as connection_count 
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `);
      metrics.database.connectionCount = parseInt(connResult.rows[0].connection_count);

      // Get query statistics
      const queryStatsResult = await db.query(`
        SELECT 
          schemaname,
          tablename,
          seq_scan,
          seq_tup_read,
          idx_scan,
          idx_tup_fetch,
          n_tup_ins,
          n_tup_upd,
          n_tup_del
        FROM pg_stat_user_tables
        ORDER BY seq_tup_read DESC
        LIMIT 10
      `);
      metrics.database.queryStats = queryStatsResult.rows;

    } catch (dbError) {
      metrics.database.error = dbError.message;
    }

    res.json(metrics);
  } catch (error) {
    next(error);
  }
};

// Get application logs (admin only)
exports.getApplicationLogs = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    const { level = 'all', limit = 100, offset = 0 } = req.query;

    // This would typically read from a logging system
    // For now, we'll return recent database activity as logs
    let query = `
      SELECT 
        'database' as source,
        'info' as level,
        'Query executed' as message,
        NOW() as timestamp
      FROM pg_stat_activity
      WHERE state = 'active'
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, [parseInt(limit), parseInt(offset)]);

    const logs = result.rows.map(row => ({
      source: row.source,
      level: row.level,
      message: row.message,
      timestamp: row.timestamp
    }));

    res.json({
      logs,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: logs.length
      },
      level
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
