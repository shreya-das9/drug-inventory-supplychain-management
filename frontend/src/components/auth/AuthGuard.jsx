import React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Authenticating..." />
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route doesn't require authentication but user is authenticated (like login/signup pages)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGuard;