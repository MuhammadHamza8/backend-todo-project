const bcrypt = require('bcryptjs');
const tokenService = require('./token.service');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const toPublicUser = (u) => ({
  id: u._id, name: u.name, email: u.email, createdAt: u.createdAt,
});

exports.signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return toPublicUser(user);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const tokens = await tokenService.issueTokenPair(user._id); // access + refresh
  return { ...tokens, user: toPublicUser(user) };
};

// Trade a valid refresh token for a NEW access token + NEW refresh token.
exports.refresh = async (refreshToken) => {
  const userId = await tokenService.consumeRefreshToken(refreshToken);

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, 'User no longer exists');

  return tokenService.issueTokenPair(user._id);
};

exports.logout = (refreshToken) => tokenService.revokeRefreshToken(refreshToken);
exports.logoutAll = (userId) => tokenService.revokeAllForUser(userId);

exports.toPublicUser = toPublicUser;