import mongoose from 'mongoose';
import generateSlug from '../utils/generateSlug.js';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['Buy', 'Rent'], required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['Available', 'Sold', 'Rented'], default: 'Available' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

propertySchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = generateSlug(this.title);
  next();
});

export default mongoose.model('Property', propertySchema);