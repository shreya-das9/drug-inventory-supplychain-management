// const express = require('express');
// const router = express.Router();

// const { 
//   getAdminDashboard, 
//   getWarehouseDashboard, 
//   getRetailerDashboard 
// } = require('../controllers/dashboard.controllers');

// const auth = require('../middleware/auth');
// const { requireAdmin, requireWarehouse, requireRetailer } = require('../middleware/requireRole');

// // Apply authentication to all admin routes
// router.use(auth);

// // Admin only routes
// router.get('/dashboard', requireAdmin(), getAdminDashboard);

// // Warehouse manager routes (Admin + Warehouse)
// router.get('/warehouse/dashboard', requireWarehouse(), getWarehouseDashboard);

// // Retailer routes (Admin + Warehouse + Retailer)
// router.get('/retailer/dashboard', requireRetailer(), getRetailerDashboard);

// module.exports = router;



// Add to backend/src/routes/admin.js
router.get('/activity', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const activities = await DatabaseMonitor.getRecentActivity(100);
    const userStats = await DatabaseMonitor.getUserStats();
    
    res.json({ activities, userStats });
  } catch (error) {
    console.error('Admin activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});