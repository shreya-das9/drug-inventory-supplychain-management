// const express = require('express');
// const router = express.Router();

// const { getProfile } = require('../controllers/user/profile.controller');
// const { getUserDashboard } = require('../controllers/dashboard.controllers');

// const auth = require('../middleware/auth');
// const { requireUser } = require('../middleware/requireRole');

// // Apply authentication to all user routes
// router.use(auth);
// router.use(requireUser());

// // GET /api/user/profile
// router.get('/profile', getProfile);

// // GET /api/user/dashboard
// router.get('/dashboard', getUserDashboard);

// module.exports = router;





// src/routes/users.js
const router = require('express').Router();

// placeholder so /api/users doesn't 404 or crash
router.get('/ping', (req, res) => res.json({ ok: true }));

module.exports = router;
