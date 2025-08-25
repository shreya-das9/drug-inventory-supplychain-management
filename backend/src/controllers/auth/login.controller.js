const AuthService = require('../../services/auth.service');
const logger = require('../../config/logger');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    const result = await AuthService.login(email, password);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logger.info(`Successful login for user: ${email} with role: ${result.user.role}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    logger.error(`Login failed for ${req.body.email}: ${error.message}`);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { login };