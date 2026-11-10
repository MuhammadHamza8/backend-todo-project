module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'JsonWebTokenError') { status = 401; message = 'Invalid token'; }
  else if (err.name === 'TokenExpiredError') { status = 401; message = 'Token expired'; }
  else if (err.name === 'CastError') { status = 400; message = 'Invalid ID format'; }
  else if (err.name === 'ValidationError') { status = 400; }
  else if (err.code === 11000) { status = 409; message = 'Duplicate value'; }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : message });
};