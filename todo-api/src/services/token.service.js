const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const ApiError = require('../utils/ApiError');

// Scramble a token before saving/searching it in the database.
const hash = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });


// "jti" is a random ID so every refresh token is unique.
const signRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId, jti: crypto.randomUUID() }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  const { exp } = jwt.decode(token);
  await RefreshToken.create({
    userId,
    tokenHash: hash(token),
    expiresAt: new Date(exp * 1000),
  });
  return token;
};
// 

exports.issueTokenPair = async (userId) => ({
  accessToken: signAccessToken(userId),
  refreshToken: await signRefreshToken(userId),
});

// Verify a refresh token and "use it up" (it works only once). Returns the user's ID.
exports.consumeRefreshToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Find + delete in one step. Not found = already used or logged out,
  // so possibly stolen: log the user out everywhere to be safe.
  const found = await RefreshToken.findOneAndDelete({ tokenHash: hash(token) });
  if (!found) {
    await RefreshToken.deleteMany({ userId: payload.id });
    throw new ApiError(401, 'Refresh token already used. Please log in again');
  }
  return payload.id;
};

exports.revokeRefreshToken = (token) => RefreshToken.deleteOne({ tokenHash: hash(token) });
exports.revokeAllForUser = (userId) => RefreshToken.deleteMany({ userId });
