const AuthService = require('../../services/auth.service');
const logger = require('../../config/logger');

const signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    logger.info(`Signup attempt for email: ${email} with role: ${role || 'USER'}`);

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logger.info(`Successful signup for user: ${email} with role: ${result.user.role}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    logger.error(`Signup failed for ${req.body.email}: ${error.message}`);
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

module.exports = { signup };