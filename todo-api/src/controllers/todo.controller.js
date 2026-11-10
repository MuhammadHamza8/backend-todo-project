const todoService = require('../services/todo.service');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res) => {
  const todo = await todoService.create(req.user._id, req.body);
  res.status(201).json({ success: true, data: todo });
});

exports.getAll = catchAsync(async (req, res) => {
  const todos = await todoService.getAll(req.user._id);
  res.status(200).json({ success: true, count: todos.length, data: todos });
});

exports.getOne = catchAsync(async (req, res) => {
  const todo = await todoService.getOne(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: todo });
});

exports.update = catchAsync(async (req, res) => {
  const todo = await todoService.update(req.user._id, req.params.id, req.body);
  res.status(200).json({ success: true, data: todo });
});

exports.remove = catchAsync(async (req, res) => {
  await todoService.remove(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Todo deleted' });
});