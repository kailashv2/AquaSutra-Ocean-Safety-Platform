const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportsController = require('../controllers/reportsController');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/roles');
const { validateRequest } = require('../middleware/validator');

// Get all reports (with optional filters)
router.get('/', 
  authenticate, 
  requirePermission('report:view:public'),
  reportsController.getReports
);

// Get a single report by ID
router.get('/:id', 
  authenticate, 
  requirePermission('report:view:public'),
  reportsController.getReportById
);

// Create a new report
router.post(
  '/',
  authenticate,
  requirePermission('report:create'),
  [
    body('hazardType').notEmpty().withMessage('Hazard type is required'),
    body('location').notEmpty().withMessage('Location is required'),
    validateRequest
  ],
  reportsController.createReport
);

// Update report verification status
router.patch(
  '/:id/verify',
  authenticate,
  requirePermission('report:verify'),
  reportsController.verifyReport
);

// Delete a report
router.delete(
  '/:id',
  authenticate,
  reportsController.deleteReport
);

module.exports = router;