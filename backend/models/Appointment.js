import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, lowercase: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  date:       { type: String, required: true },   // e.g. "2026-09-10"
  time:       { type: String, required: true },   // e.g. "10:00 AM"
  message:    { type: String, default: '' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:     { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
