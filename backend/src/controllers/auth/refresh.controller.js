const AuthService = require('../../services/auth.service');
const logger = require('../../config/logger');

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    logger.info('Token refreshed successfully');

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    logger.error(`Token refresh failed: ${error.message}`);
    
    // Clear the invalid refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { refresh };