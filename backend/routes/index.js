const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const reportRoutes = require('./reports');
const analyticsRoutes = require('./analytics');
const socialRoutes = require('./social');

// Register routes
router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/social', socialRoutes);

module.exports = router;