import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  region: { type: String, required: true, trim: true }, // e.g., Southern, Central, etc.
  description: { type: String, required: true, trim: true },
  images: [{ type: String }], // URLs
  mapUrl: { type: String },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
