const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/roles');

// Get social media posts with filtering
router.get('/posts', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getSocialMediaPosts
);

// Get social media posts near a location
router.get('/posts/nearby', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getNearbyPosts
);

// Get trending hazard-related posts
router.get('/posts/trending', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getTrendingPosts
);

// Get sentiment analysis summary
router.get('/sentiment', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getSentimentAnalysis
);

// Get trending keywords
router.get('/keywords/trending', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getTrendingKeywords
);

// Set up monitoring for keywords/locations
router.post('/monitor', 
  authenticate, 
  requirePermission('social:configure'),
  socialController.setupMonitoring
);

// Get social media alerts
router.get('/alerts', 
  authenticate, 
  requirePermission('social:monitor'),
  socialController.getSocialMediaAlerts
);

// Get platform engagement metrics
router.get('/metrics/platforms', 
  authenticate, 
  requirePermission('analytics:view:advanced'),
  socialController.getPlatformMetrics
);

module.exports = router;