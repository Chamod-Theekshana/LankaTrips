import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  date: { type: Date, required: true },
  travelers: { type: Number, required: true, min: 1, max: 50 },
  pickupCity: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
