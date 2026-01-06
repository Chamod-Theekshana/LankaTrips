import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, trim: true }, // Adventure, Beach, Culture...
  region: { type: String, required: true, trim: true },
  locationRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  itinerary: [{ type: String, trim: true }],
  includes: [{ type: String, trim: true }],
  excludes: [{ type: String, trim: true }],
  images: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Package', packageSchema);
