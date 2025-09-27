const db = require('../config/db');

// Define role hierarchy and permissions
const ROLES = {
  citizen: {
    level: 1,
    permissions: [
      'report:create',
      'report:view:public',
      'report:update:own',
      'report:comment',
      'dashboard:view:basic',
      'map:view:public',
      'notification:receive',
      'profile:update:own'
    ]
  },
  official: {
    level: 2,
    permissions: [
      'report:create',
      'report:view:all',
      'report:update:own',
      'report:verify',
      'report:comment',
      'report:priority:set',
      'dashboard:view:advanced',
      'map:view:detailed',
      'analytics:view:basic',
      'notification:send:local',
      'notification:receive',
      'profile:update:own',
      'user:view:basic'
    ]
  },
  analyst: {
    level: 3,
    permissions: [
      'report:create',
      'report:view:all',
      'report:update:any',
      'report:verify',
      'report:comment',
      'report:priority:set',
      'report:export',
      'dashboard:view:advanced',
      'map:view:detailed',
      'analytics:view:advanced',
      'analytics:export',
      'nlp:configure',
      'hotspot:configure',
      'notification:send:regional',
      'notification:receive',
      'profile:update:own',
      'user:view:detailed',
      'social:monitor',
      'social:configure'
    ]
  },
  emergency_responder: {
    level: 3,
    permissions: [
      'report:create',
      'report:view:all',
      'report:update:own',
      'report:verify',
      'report:comment',
      'report:priority:set',
      'report:assign',
      'report:resolve',
      'dashboard:view:emergency',
      'map:view:detailed',
      'analytics:view:emergency',
      'notification:send:emergency',
      'notification:receive:priority',
      'alert:create',
      'alert:manage',
      'response:coordinate',
      'profile:update:own',
      'user:view:responders',
      'communication:emergency'
    ]
  },
  administrator: {
    level: 4,
    permissions: [
      'report:create',
      'report:view:all',
      'report:update:any',
      'report:delete:any',
      'report:verify',
      'report:comment',
      'report:priority:set',
      'report:assign',
      'report:resolve',
      'report:export',
      'dashboard:view:admin',
      'map:view:detailed',
      'analytics:view:all',
      'analytics:export',
      'nlp:configure',
      'hotspot:configure',
      'notification:send:all',
      'notification:receive',
      'alert:create',
      'alert:manage',
      'response:coordinate',
      'user:create',
      'user:view:all',
      'user:update:any',
      'user:delete',
      'user:role:assign',
      'system:configure',
      'system:monitor',
      'system:backup',
      'profile:update:any',
      'social:monitor',
      'social:configure',
      'communication:emergency'
    ]
  }
};

// Check if user has specific permission
const hasPermission = (userRole, permission) => {
  const role = ROLES[userRole];
  if (!role) return false;
  return role.permissions.includes(permission);
};

// Check if user role has sufficient level
const hasMinimumLevel = (userRole, minimumLevel) => {
  const role = ROLES[userRole];
  if (!role) return false;
  return role.level >= minimumLevel;
};

// Middleware to check permissions
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Get fresh user data including role
      const result = await db.query(
        'SELECT role, is_active FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      if (!hasPermission(user.role, permission)) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: permission,
          userRole: user.role
        });
      }

      // Update user role in request object
      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check minimum role level
const requireMinimumLevel = (level) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const result = await db.query(
        'SELECT role, is_active FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      if (!hasMinimumLevel(user.role, level)) {
        return res.status(403).json({ 
          message: 'Insufficient role level',
          required: level,
          userRole: user.role
        });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Role level check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check multiple permissions (OR logic)
const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const result = await db.query(
        'SELECT role, is_active FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      const hasAnyPermission = permissions.some(permission => 
        hasPermission(user.role, permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: permissions,
          userRole: user.role
        });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check if user can access specific report
const canAccessReport = async (req, res, next) => {
  try {
    const reportId = req.params.id || req.body.reportId;
    
    if (!reportId) {
      return res.status(400).json({ message: 'Report ID required' });
    }

    const result = await db.query(
      'SELECT user_id, is_anonymous FROM reports WHERE id = $1',
      [reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = result.rows[0];

    // Check if user can access this report
    const canAccess = 
      report.user_id === req.user.id || // Own report
      hasPermission(req.user.role, 'report:view:all') || // Has permission to view all
      (!report.is_anonymous && hasPermission(req.user.role, 'report:view:public')); // Public report

    if (!canAccess) {
      return res.status(403).json({ message: 'Cannot access this report' });
    }

    req.report = report;
    next();
  } catch (error) {
    console.error('Report access check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user permissions
const getUserPermissions = (role) => {
  const roleData = ROLES[role];
  return roleData ? roleData.permissions : [];
};

// Get all roles
const getAllRoles = () => {
  return Object.keys(ROLES);
};

module.exports = {
  ROLES,
  hasPermission,
  hasMinimumLevel,
  requirePermission,
  requireMinimumLevel,
  requireAnyPermission,
  canAccessReport,
  getUserPermissions,
  getAllRoles
};
