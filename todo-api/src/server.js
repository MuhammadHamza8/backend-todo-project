require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const start = async () => {
  await connectDB();
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
};

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});