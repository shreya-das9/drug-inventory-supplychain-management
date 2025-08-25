import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ROLE_HIERARCHY = {
  'ADMIN': 4,
  'WAREHOUSE': 3,
  'RETAILER': 2,
  'USER': 1
};

const RoleGuard = ({ children, allowedRoles, fallbackPath = '/dashboard' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRoleLevel = ROLE_HIERARCHY[user.role];
  const hasPermission = allowedRoles.some(role => {
    const requiredRoleLevel = ROLE_HIERARCHY[role];
    return userRoleLevel >= requiredRoleLevel;
  });

  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleGuard;