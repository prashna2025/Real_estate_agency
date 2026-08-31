import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['Admin', 'Agent'], default: 'Admin' },
  specialization: { type: String, default: '' },  // e.g. 'Luxury Homes', 'Commercial'
  photo: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  bio: String,
  phone: String,
  reviews: [{ reviewerName: String, rating: { type: Number, min: 1, max: 5 }, comment: String, createdAt: { type: Date, default: Date.now } }],
  rating: { type: Number, default: 0 },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Admin', adminSchema);
