import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth components
import AuthGuard from "../components/auth/AuthGuard";
import RoleGuard from "../components/auth/RoleGuard";

// Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";

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

          {/* Role-based routes */}
          <Route
            path="/admin/*"
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/warehouse/*"
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={["ADMIN", "WAREHOUSE"]}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/retailer/*"
            element={
              <AuthGuard requireAuth={true}>
                <RoleGuard allowedRoles={["ADMIN", "WAREHOUSE", "RETAILER"]}>
                  <Dashboard />
                </RoleGuard>
              </AuthGuard>
            }
          />

          {/* Default Route → handled by AuthGuard */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
