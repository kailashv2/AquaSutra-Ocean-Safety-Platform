const db = require('../config/db');
const offlineService = require('../services/offlineService');

// Sync offline data
exports.syncOfflineData = async (req, res, next) => {
  try {
    const { syncData } = req.body;

    if (!syncData || !Array.isArray(syncData)) {
      return res.status(400).json({ message: 'syncData array is required' });
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: []
    };

    for (const item of syncData) {
      try {
        const { action, tableName, data, tempId } = item;

        if (!action || !tableName || !data) {
          results.failed++;
          results.errors.push({
            tempId,
            error: 'Missing required fields: action, tableName, data'
          });
          continue;
        }

        await offlineService.addToSyncQueue(
          req.user.id,
          action,
          tableName,
          data,
          'high' // High priority for user-initiated sync
        );

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          tempId: item.tempId,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Sync request processed',
      results,
      syncedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get sync status for user
exports.getSyncStatus = async (req, res, next) => {
  try {
    const status = await offlineService.getSyncStatus(req.user.id);

    res.json({
      userId: req.user.id,
      syncStatus: status,
      lastChecked: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get offline data for user
exports.getOfflineData = async (req, res, next) => {
  try {
    const { lastSyncTime } = req.query;

    const offlineData = await offlineService.getOfflineData(
      req.user.id,
      lastSyncTime
    );

    res.json({
      userId: req.user.id,
      data: offlineData,
      generatedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Retry failed sync items
exports.retryFailedSyncs = async (req, res, next) => {
  try {
    const retriedCount = await offlineService.retryFailedSyncs(req.user.id);

    res.json({
      message: 'Failed sync items queued for retry',
      retriedCount,
      retriedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get sync queue status (admin only)
exports.getSyncQueueStatus = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    const result = await db.query(`
      SELECT 
        sync_status,
        table_name,
        action,
        COUNT(*) as count,
        MIN(created_at) as oldest_item,
        MAX(created_at) as newest_item
      FROM offline_sync_queue
      GROUP BY sync_status, table_name, action
      ORDER BY sync_status, count DESC
    `);

    const queueStats = result.rows.map(row => ({
      status: row.sync_status,
      tableName: row.table_name,
      action: row.action,
      count: parseInt(row.count),
      oldestItem: row.oldest_item,
      newestItem: row.newest_item
    }));

    // Get overall statistics
    const overallResult = await db.query(`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN sync_status = 'pending' THEN 1 END) as pending_items,
        COUNT(CASE WHEN sync_status = 'completed' THEN 1 END) as completed_items,
        COUNT(CASE WHEN sync_status = 'failed' THEN 1 END) as failed_items,
        AVG(attempts) as avg_attempts
      FROM offline_sync_queue
    `);

    const overall = overallResult.rows[0];

    res.json({
      queueStats,
      overall: {
        totalItems: parseInt(overall.total_items),
        pendingItems: parseInt(overall.pending_items),
        completedItems: parseInt(overall.completed_items),
        failedItems: parseInt(overall.failed_items),
        avgAttempts: parseFloat(overall.avg_attempts || 0)
      },
      checkedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Process sync queue manually (admin only)
exports.processSyncQueue = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Administrator access required' });
    }

    // Trigger manual sync processing
    await offlineService.processSyncQueue();

    res.json({
      message: 'Sync queue processing triggered',
      triggeredBy: req.user.id,
      triggeredAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get user sync history
exports.getUserSyncHistory = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await db.query(`
      SELECT 
        id, action, table_name, sync_status, error_message,
        attempts, created_at, synced_at
      FROM offline_sync_queue
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.id, parseInt(limit), parseInt(offset)]);

    const history = result.rows.map(row => ({
      id: row.id,
      action: row.action,
      tableName: row.table_name,
      status: row.sync_status,
      errorMessage: row.error_message,
      attempts: row.attempts,
      createdAt: row.created_at,
      syncedAt: row.synced_at
    }));

    // Get total count for pagination
    const countResult = await db.query(`
      SELECT COUNT(*) as total
      FROM offline_sync_queue
      WHERE user_id = $1
    `, [req.user.id]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      history,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear completed sync records
exports.clearCompletedSyncs = async (req, res, next) => {
  try {
    const { olderThan = '7d' } = req.query;

    const intervalMap = {
      '1d': '1 day',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[olderThan] || '7 days';

    let query = `
      DELETE FROM offline_sync_queue
      WHERE sync_status = 'completed'
      AND synced_at < NOW() - INTERVAL '${interval}'
    `;

    const params = [];

    // Non-admin users can only clear their own records
    if (req.user.role !== 'administrator') {
      query += ` AND user_id = $1`;
      params.push(req.user.id);
    }

    const result = await db.query(query, params);

    res.json({
      message: 'Completed sync records cleared',
      deletedCount: result.rowCount,
      olderThan,
      clearedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Get sync performance metrics (admin only)
exports.getSyncMetrics = async (req, res, next) => {
  try {
    // Check admin permissions
    if (!req.user || !['administrator', 'analyst'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const { timeframe = '24h' } = req.query;

    const intervalMap = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days'
    };
    const interval = intervalMap[timeframe] || '24 hours';

    // Get sync performance metrics
    const performanceResult = await db.query(`
      SELECT 
        table_name,
        action,
        COUNT(*) as total_syncs,
        COUNT(CASE WHEN sync_status = 'completed' THEN 1 END) as successful_syncs,
        COUNT(CASE WHEN sync_status = 'failed' THEN 1 END) as failed_syncs,
        AVG(attempts) as avg_attempts,
        AVG(EXTRACT(EPOCH FROM (synced_at - created_at))) as avg_sync_time_seconds
      FROM offline_sync_queue
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY table_name, action
      ORDER BY total_syncs DESC
    `);

    // Get temporal trends
    const trendsResult = await db.query(`
      SELECT 
        DATE_TRUNC('hour', created_at) as time_bucket,
        COUNT(*) as syncs_created,
        COUNT(CASE WHEN sync_status = 'completed' THEN 1 END) as syncs_completed,
        COUNT(CASE WHEN sync_status = 'failed' THEN 1 END) as syncs_failed
      FROM offline_sync_queue
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY time_bucket
    `);

    // Get user activity
    const userActivityResult = await db.query(`
      SELECT 
        u.role,
        COUNT(DISTINCT osq.user_id) as active_users,
        COUNT(osq.id) as total_syncs,
        AVG(osq.attempts) as avg_attempts
      FROM offline_sync_queue osq
      JOIN users u ON osq.user_id = u.id
      WHERE osq.created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY u.role
      ORDER BY total_syncs DESC
    `);

    res.json({
      timeframe,
      performance: performanceResult.rows.map(row => ({
        tableName: row.table_name,
        action: row.action,
        totalSyncs: parseInt(row.total_syncs),
        successfulSyncs: parseInt(row.successful_syncs),
        failedSyncs: parseInt(row.failed_syncs),
        successRate: row.total_syncs > 0 ? 
          (row.successful_syncs / row.total_syncs * 100).toFixed(2) : 0,
        avgAttempts: parseFloat(row.avg_attempts || 0),
        avgSyncTimeSeconds: parseFloat(row.avg_sync_time_seconds || 0)
      })),
      trends: trendsResult.rows.map(row => ({
        time: row.time_bucket,
        syncsCreated: parseInt(row.syncs_created),
        syncsCompleted: parseInt(row.syncs_completed),
        syncsFailed: parseInt(row.syncs_failed)
      })),
      userActivity: userActivityResult.rows.map(row => ({
        role: row.role,
        activeUsers: parseInt(row.active_users),
        totalSyncs: parseInt(row.total_syncs),
        avgAttempts: parseFloat(row.avg_attempts || 0)
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
