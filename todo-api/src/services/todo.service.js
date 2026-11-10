const Todo = require('../models/Todo');
const ApiError = require('../utils/ApiError');

exports.create = (userId, { title, description, completed }) =>
  Todo.create({ title, description, completed, userId });

exports.getAll = (userId) => Todo.find({ userId }).sort({ createdAt: -1 });

exports.getOne = async (userId, id) => {
  const todo = await Todo.findOne({ _id: id, userId }); // owner check built into the query
  if (!todo) throw new ApiError(404, 'Todo not found');
  return todo;
};

exports.update = async (userId, id, data) => {
  const allowed = {};
  for (const key of ['title', 'description', 'completed']) {
    if (data[key] !== undefined) allowed[key] = data[key]; // whitelist: can't change userId
  }
  const todo = await Todo.findOneAndUpdate({ _id: id, userId }, allowed, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw new ApiError(404, 'Todo not found');
  return todo;
};

exports.remove = async (userId, id) => {
  const todo = await Todo.findOneAndDelete({ _id: id, userId });
  if (!todo) throw new ApiError(404, 'Todo not found');
};