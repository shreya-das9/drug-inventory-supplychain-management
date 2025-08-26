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
const {
  getAdminDashboard,
  getWarehouseDashboard,
  getRetailerDashboard,
  getUserDashboard,
} = require('../controllers/dashboard.controllers');

// Map routes
router.get('/admin', getAdminDashboard);
router.get('/warehouse', getWarehouseDashboard);
router.get('/retailer', getRetailerDashboard);
router.get('/user', getUserDashboard);

module.exports = router;

