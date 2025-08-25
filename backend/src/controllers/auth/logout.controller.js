const AuthService = require('../../services/auth.service');
const logger = require('../../config/logger');

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    logger.info('User logged out successfully');

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    
    // Still clear cookie and return success even if there's an error
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
};

module.exports = { logout };