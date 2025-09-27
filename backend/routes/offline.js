const express = require('express');
const router = express.Router();
const offlineController = require('../controllers/offlineController');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/roles');

// Sync offline data
router.post('/sync', 
  authenticate,
  offlineController.syncOfflineData
);

// Get sync status
router.get('/sync/status', 
  authenticate,
  offlineController.getSyncStatus
);

// Get offline data for user
router.get('/data', 
  authenticate,
  offlineController.getOfflineData
);

// Retry failed syncs
router.post('/sync/retry', 
  authenticate,
  offlineController.retryFailedSyncs
);

// Get sync queue status (admin only)
router.get('/sync/queue', 
  authenticate, 
  requirePermission('system:monitor'),
  offlineController.getSyncQueueStatus
);

// Process sync queue manually (admin only)
router.post('/sync/process', 
  authenticate, 
  requirePermission('system:configure'),
  offlineController.processSyncQueue
);

// Get user sync history
router.get('/sync/history', 
  authenticate,
  offlineController.getUserSyncHistory
);

// Clear completed sync records
router.delete('/sync/completed', 
  authenticate,
  offlineController.clearCompletedSyncs
);

// Get sync performance metrics (admin/analyst only)
router.get('/sync/metrics', 
  authenticate, 
  requirePermission('system:monitor'),
  offlineController.getSyncMetrics
);

module.exports = router;
