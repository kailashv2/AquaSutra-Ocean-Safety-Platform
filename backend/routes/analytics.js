const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/roles');

// Get comprehensive dashboard data
router.get('/dashboard', 
  authenticate, 
  requirePermission('dashboard:view:basic'),
  analyticsController.getDashboardData
);

// Get verification statistics
router.get('/verification-stats', 
  authenticate, 
  requirePermission('analytics:view:basic'),
  analyticsController.getVerificationStats
);

// Get geographic insights
router.get('/geographic', 
  authenticate, 
  requirePermission('analytics:view:basic'),
  analyticsController.getGeographicInsights
);

// Export data for analysis
router.get('/export', 
  authenticate, 
  requirePermission('analytics:export'),
  analyticsController.exportData
);

module.exports = router;