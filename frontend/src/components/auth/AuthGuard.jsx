// import React from 'react';
// import { useEffect } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import Loader from '../common/Loader';

// const AuthGuard = ({ children, requireAuth = true }) => {
//   const { isAuthenticated, loading, user, token } = useAuth();
//   const location = useLocation();

//   // Show loading while checking authentication
//   if (loading || (token && !user)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader size="lg" text="Authenticating..." />
//       </div>
//     );
//   }

//   // If route requires authentication but user is not authenticated
//   if (requireAuth && !isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If route doesn't require authentication but user is authenticated (like login/signup pages)
//   if (!requireAuth && isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default AuthGuard;

// src/components/auth/AuthGuard.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = ({ requireAuth, children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // If route requires auth but user is not logged in → redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is public (login/signup) but user is already logged in → go to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthGuard;
