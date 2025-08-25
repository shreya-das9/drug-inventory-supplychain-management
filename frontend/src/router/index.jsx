import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth components
import AuthGuard from '../components/auth/AuthGuard';
import RoleGuard from '../components/auth/RoleGuard';

// Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthGuard requireAuth={false}>
                <Signup />
              </AuthGuard>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <Dashboard />
              </AuthGuard>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            } 
          />

          {/* Warehouse Routes */}
          <Route 
            path="/warehouse/*" 
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={['ADMIN', 'WAREHOUSE']}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            } 
          />

          {/* Retailer Routes */}
          <Route 
            path="/retailer/*" 
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={['ADMIN', 'WAREHOUSE', 'RETAILER']}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            } 
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;