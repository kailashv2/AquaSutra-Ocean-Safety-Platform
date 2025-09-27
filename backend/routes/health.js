const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { authenticate } = require('../middleware/auth');

// Public health check endpoint
router.get('/', healthController.getHealthStatus);

// Get detailed service status (admin only)
router.get('/services', 
  authenticate,
  healthController.getServiceStatus
);

// Restart a specific service (admin only)
router.post('/services/:serviceName/restart', 
  authenticate,
  healthController.restartService
);

// Get system metrics (admin/analyst only)
router.get('/metrics', 
  authenticate,
  healthController.getSystemMetrics
);

// Get application logs (admin only)
router.get('/logs', 
  authenticate,
  healthController.getApplicationLogs
);

module.exports = router;
