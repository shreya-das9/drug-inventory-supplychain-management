// const express = require('express');
// const router = express.Router();
// const {
//   getAdminDashboard,
//   getWarehouseDashboard,
//   getRetailerDashboard,
//   getUserDashboard,
// } = require('../controllers/dashboard.controllers');

// // Admin dashboard
// router.get('/admin', getAdminDashboard);

// // Warehouse dashboard
// router.get('/warehouse', getWarehouseDashboard);

// // Retailer dashboard
// router.get('/retailer', getRetailerDashboard);

// // User dashboard
// router.get('/user', getUserDashboard);

// module.exports = router;

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