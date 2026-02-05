// Database configuration and connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // In serverless environments, avoid process.exit.
    // Rethrow so the function fails with a clear stack trace.
    throw error;
  }
};

module.exports = connectDB;
