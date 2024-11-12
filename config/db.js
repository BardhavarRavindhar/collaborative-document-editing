// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {

    const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/my_database_name"; // Use env variable if available
    
    await mongoose.connect(DB_URI, {});
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  }
};

module.exports = connectDB;
