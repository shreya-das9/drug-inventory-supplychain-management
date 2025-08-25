const express = require('express');
const router = express.Router();

const { 
  getAdminDashboard, 
  getWarehouseDashboard, 
  getRetailerDashboard 
} = require('../controllers/dashboard.controllers');

const auth = require('../middleware/auth');
const { requireAdmin, requireWarehouse, requireRetailer } = require('../middleware/requireRole');

// Apply authentication to all admin routes
router.use(auth);

// Admin only routes
router.get('/dashboard', requireAdmin(), getAdminDashboard);

// Warehouse manager routes (Admin + Warehouse)
router.get('/warehouse/dashboard', requireWarehouse(), getWarehouseDashboard);

// Retailer routes (Admin + Warehouse + Retailer)
router.get('/retailer/dashboard', requireRetailer(), getRetailerDashboard);

module.exports = router;