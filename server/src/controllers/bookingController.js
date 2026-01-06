import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Receipt from '../models/Receipt.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { makeReceiptNo } from '../utils/receiptNo.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { packageId, date, travelers, pickupCity, phone } = req.validated.body;

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  const travelDate = new Date(date);
  if (Number.isNaN(travelDate.getTime())) {
    res.status(400);
    throw new Error('Invalid date');
  }

  const totalPrice = Number(pkg.price) * Number(travelers);

  const booking = await Booking.create({
    userRef: req.user._id,
    packageRef: pkg._id,
    date: travelDate,
    travelers,
    pickupCity,
    phone,
    totalPrice,
    status: 'pending'
  });

  // Auto-create receipt for Pay Later
  const receipt = await Receipt.create({
    bookingRef: booking._id,
    receiptNo: makeReceiptNo(),
    amount: booking.totalPrice,
    currency: process.env.DEFAULT_CURRENCY || 'LKR',
    paymentMethod: 'PAY_LATER',
    paymentStatus: 'UNPAID'
  });

  return ok(res, { bookingId: booking._id, receiptId: receipt._id }, 'Booking created');
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const items = await Booking.find({ userRef: req.user._id })
    .populate('packageRef', 'title price durationDays category region images')
    .sort('-createdAt');

  return ok(res, items, 'My bookings');
});

export const listAllBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const q = req.query.q?.trim();
  const search = q ? { pickupCity: { $regex: q, $options: 'i' } } : {};

  const [items, total] = await Promise.all([
    Booking.find({ ...filters, ...search })
      .populate('userRef', 'name email role')
      .populate('packageRef', 'title price')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Booking.countDocuments({ ...filters, ...search })
  ]);

  return ok(res, items, 'Bookings', { page, limit, total });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = status;
  await booking.save();
  return ok(res, booking, 'Booking status updated');
});
