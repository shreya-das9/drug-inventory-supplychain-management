import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import Loader from '../components/common/Loader';
import {
  BarChart3,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user, dashboardData, getDashboard, loading } = useAuth();

  useEffect(() => {
    if (user && !dashboardData) {
      getDashboard();
    }
  }, [user, dashboardData, getDashboard]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  const getStatsForRole = (role, stats) => {
    const roleStats = {
      ADMIN: [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600' },
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-green-600' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: BarChart3, color: 'text-purple-600' },
        { label: 'System Health', value: stats?.systemHealth || 'Good', icon: CheckCircle, color: 'text-emerald-600' },
      ],
      WAREHOUSE: [
        { label: 'Stock Items', value: stats?.stockItems || 0, icon: Package, color: 'text-blue-600' },
        { label: 'Low Stock Alerts', value: stats?.lowStockAlerts || 0, icon: AlertTriangle, color: 'text-orange-600' },
        { label: 'Pending Shipments', value: stats?.pendingShipments || 0, icon: TrendingUp, color: 'text-purple-600' },
        { label: 'Expiry Alerts', value: stats?.expiryAlerts || 0, icon: AlertTriangle, color: 'text-red-600' },
      ],
      RETAILER: [
        { label: 'Today Sales', value: stats?.todaySales || 0, icon: TrendingUp, color: 'text-green-600' },
        { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Package, color: 'text-orange-600' },
        { label: 'Verified Products', value: stats?.verifiedProducts || 0, icon: CheckCircle, color: 'text-emerald-600' },
        { label: 'Customers', value: stats?.customers || 0, icon: Users, color: 'text-blue-600' },
      ],
      USER: [
        { label: 'Verified Products', value: stats?.verifiedProducts || 0, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Purchase History', value: stats?.purchaseHistory || 0, icon: Package, color: 'text-blue-600' },
        { label: 'Saved Products', value: stats?.savedProducts || 0, icon: Package, color: 'text-purple-600' },
        { label: 'Notifications', value: stats?.notifications || 0, icon: AlertTriangle, color: 'text-orange-600' },
      ],
    };

    return roleStats[role] || roleStats.USER;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role} Dashboard - DrugChain Management System
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Role</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                user?.role === 'WAREHOUSE' ? 'bg-blue-100 text-blue-800' :
                user?.role === 'RETAILER' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getStatsForRole(user?.role, dashboardData?.stats).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData?.features?.map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-900">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="text-sm text-gray-600">
            Quick action buttons will be implemented based on your role and requirements.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;