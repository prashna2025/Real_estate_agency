import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Fallback for development if local DB fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Starting in-memory MongoDB as fallback...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected (Fallback): ${conn.connection.host}`);
    } else {
      throw error;
    }
  }
};

export default connectDB;