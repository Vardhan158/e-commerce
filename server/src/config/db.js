import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Please add MONGO_URI to .env file');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error: ', error.message);
    process.exit(1);
  }
};

export default connectDB;
