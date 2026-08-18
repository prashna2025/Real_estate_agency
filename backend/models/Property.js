// Add this field inside propertySchema
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },