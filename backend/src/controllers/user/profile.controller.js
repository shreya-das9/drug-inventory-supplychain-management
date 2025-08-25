const AuthService = require('../../services/auth.service');
const logger = require('../../config/logger');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const profile = await AuthService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });

  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
};

module.exports = { getProfile };