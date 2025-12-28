import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  receiptNo: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR' },
  paymentMethod: { type: String, default: 'PAY_LATER' }, // PAY_LATER | STRIPE
  paymentStatus: { type: String, enum: ['UNPAID', 'PAID', 'FAILED'], default: 'UNPAID' },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Receipt', receiptSchema);
