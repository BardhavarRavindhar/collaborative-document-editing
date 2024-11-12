const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_database_name';
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
