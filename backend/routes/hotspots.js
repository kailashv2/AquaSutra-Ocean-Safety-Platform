const express = require('express');
const router = express.Router();
const hotspotsController = require('../controllers/hotspotsController');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/roles');

// Get active hotspots
router.get('/', 
  authenticate, 
  requirePermission('map:view:detailed'),
  hotspotsController.getActiveHotspots
);

// Generate hotspots manually
router.post('/generate', 
  authenticate, 
  requirePermission('hotspot:configure'),
  hotspotsController.generateHotspots
);

// Get hotspot by ID
router.get('/:id', 
  authenticate, 
  requirePermission('map:view:detailed'),
  hotspotsController.getHotspotById
);

// Get hotspot statistics
router.get('/stats/overview', 
  authenticate, 
  requirePermission('analytics:view:basic'),
  hotspotsController.getHotspotStatistics
);

// Update hotspot settings
router.put('/settings', 
  authenticate, 
  requirePermission('hotspot:configure'),
  hotspotsController.updateHotspotSettings
);

// Get hotspots within bounds
router.get('/bounds/search', 
  authenticate, 
  requirePermission('map:view:detailed'),
  hotspotsController.getHotspotsInBounds
);

// Get hotspot history
router.get('/history/all', 
  authenticate, 
  requirePermission('analytics:view:advanced'),
  hotspotsController.getHotspotHistory
);

// Clean up inactive hotspots
router.delete('/cleanup', 
  authenticate, 
  requirePermission('system:configure'),
  hotspotsController.cleanupHotspots
);

module.exports = router;
