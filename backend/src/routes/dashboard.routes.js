

const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth'); // Add this import
const {
  getAdminDashboard,
  getWarehouseDashboard,
  getRetailerDashboard,
  getUserDashboard,
} = require('../controllers/dashboard.controllers');

// ✅ Add auth middleware to protect all routes
router.get('/admin', auth, authorize(['admin']), getAdminDashboard);
router.get('/warehouse', auth, authorize(['admin', 'warehouse']), getWarehouseDashboard);
router.get('/retailer', auth, authorize(['admin', 'retailer']), getRetailerDashboard);
router.get('/user', auth, getUserDashboard); // All authenticated users

module.exports = router;