const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshTokenModel = require('../models/RefreshTokenModel');

class JwtService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async generateTokenPair(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await RefreshTokenModel.create(refreshToken, user.id, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };
  }

  static async refreshAccessToken(refreshToken) {
    const tokenData = await RefreshTokenModel.findByToken(refreshToken);
    
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    if (!tokenData.is_active) {
      throw new Error('User account is inactive');
    }

    // Generate new access token
    const payload = {
      id: tokenData.user_id,
      email: tokenData.email,
      role: tokenData.role,
    };

    const accessToken = this.generateAccessToken(payload);

    return {
      accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };
  }

  static async revokeRefreshToken(refreshToken) {
    await RefreshTokenModel.deleteByToken(refreshToken);
  }

  static async revokeAllUserTokens(userId) {
    await RefreshTokenModel.deleteByUserId(userId);
  }
}

module.exports = JwtService;