import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import AdminDashboard from './dashboards/AdminDashboard';
import WarehouseDashboard from './dashboards/WarehouseDashboard';
import RetailerDashboard from './dashboards/RetailerDashboard';
import UserDashboard from './dashboards/UserDashboard';

const DashboardRouter = () => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'ADMIN': return <AdminDashboard />;
    case 'WAREHOUSE': return <WarehouseDashboard />;
    case 'RETAILER': return <RetailerDashboard />;
    case 'USER':
    default: return <UserDashboard />;
  }
};

export default DashboardRouter;
