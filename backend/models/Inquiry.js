import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, lowercase: true, trim: true },
	phone: { type: String, required: true, trim: true },
	message: { type: String, required: true },
	propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
	status: { type: String, enum: ['New', 'Contacted', 'Resolved'], default: 'New' },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
