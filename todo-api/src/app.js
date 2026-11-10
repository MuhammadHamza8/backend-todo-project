const express = require('express');
const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

module.exports = app;