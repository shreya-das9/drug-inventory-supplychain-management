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