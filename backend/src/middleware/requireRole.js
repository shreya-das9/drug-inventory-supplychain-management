// Role hierarchy: ADMIN > WAREHOUSE > RETAILER > USER
const ROLE_HIERARCHY = {
  'ADMIN': 4,
  'WAREHOUSE': 3,
  'RETAILER': 2,
  'USER': 1
};

const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      const userRoleLevel = ROLE_HIERARCHY[userRole];

      // Handle single role or array of roles
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      
      // Check if user has any of the required roles
      const hasRequiredRole = roles.some(role => {
        const requiredRoleLevel = ROLE_HIERARCHY[role];
        return userRoleLevel >= requiredRoleLevel;
      });

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Convenience functions for specific roles
const requireAdmin = () => requireRole('ADMIN');
const requireWarehouse = () => requireRole(['ADMIN', 'WAREHOUSE']);
const requireRetailer = () => requireRole(['ADMIN', 'WAREHOUSE', 'RETAILER']);
const requireUser = () => requireRole(['ADMIN', 'WAREHOUSE', 'RETAILER', 'USER']);

module.exports = {
  requireRole,
  requireAdmin,
  requireWarehouse,
  requireRetailer,
  requireUser,
  ROLE_HIERARCHY
};