import mongoose from 'mongoose';

const connectDB = async () => {
	const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/real_estate_agency';
	return mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
};

export default connectDB;
