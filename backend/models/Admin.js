// Add these fields inside your existing adminSchema
  isVerified: { type: Boolean, default: false },
  bio: { type: String },
  phone: { type: String },
  reviews: [{
    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 } // Average rating