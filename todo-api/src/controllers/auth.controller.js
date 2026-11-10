const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  const user = await authService.signup(req.body);
  res.status(201).json({ success: true, data: user });
});

exports.login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({ success: true, data: result });
});

exports.me = (req, res) => {
  res.status(200).json({ success: true, data: authService.toPublicUser(req.user) });
};