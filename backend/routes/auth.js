const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate, userValidationRules } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');

// Register new user
router.post(
  '/register',
  userValidationRules.register,
  validate,
  authController.register
);

// Login user
router.post(
  '/login',
  userValidationRules.login,
  validate,
  authController.login
);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;