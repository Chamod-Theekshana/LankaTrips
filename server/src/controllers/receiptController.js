import Receipt from '../models/Receipt.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import User from '../models/User.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { streamReceiptPdf } from '../utils/pdf.js';
import { toCsv } from '../utils/csv.js';

export const listMyReceipts = asyncHandler(async (req, res) => {
  // Join via bookingRef -> ensure receipt belongs to user
  const bookings = await Booking.find({ userRef: req.user._id }).select('_id');
  const bookingIds = bookings.map(b => b._id);

  const items = await Receipt.find({ bookingRef: { $in: bookingIds } })
    .populate({ path: 'bookingRef', populate: { path: 'packageRef', select: 'title' } })
    .sort('-issuedAt');

  return ok(res, items, 'My receipts');
});

export const listAllReceipts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.paymentStatus) filters.paymentStatus = req.query.paymentStatus;
  if (req.query.paymentMethod) filters.paymentMethod = req.query.paymentMethod;

  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  if (from || to) {
    filters.issuedAt = {};
    if (from) filters.issuedAt.$gte = from;
    if (to) filters.issuedAt.$lte = to;
  }

  const [items, total] = await Promise.all([
    Receipt.find(filters)
      .populate({
        path: 'bookingRef',
        populate: [
          { path: 'userRef', select: 'name email' },
          { path: 'packageRef', select: 'title' }
        ]
      })
      .sort('-issuedAt')
      .skip(skip)
      .limit(limit),
    Receipt.countDocuments(filters)
  ]);

  return ok(res, items, 'Receipts', { page, limit, total });
});

export const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id).populate({
    path: 'bookingRef',
    populate: [
      { path: 'userRef', select: 'name email role' },
      { path: 'packageRef', select: 'title price durationDays category region' }
    ]
  });

  if (!receipt) {
    res.status(404);
    throw new Error('Receipt not found');
  }

  // authorization: admin OR owner
  const ownerId = receipt.bookingRef?.userRef?._id?.toString();
  if (req.user.role !== 'admin' && ownerId !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  return ok(res, receipt, 'Receipt');
});

export const downloadReceiptPdf = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);
  if (!receipt) {
    res.status(404);
    throw new Error('Receipt not found');
  }

  const booking = await Booking.findById(receipt.bookingRef);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // auth
  if (req.user.role !== 'admin' && booking.userRef.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const [pkg, user] = await Promise.all([
    Package.findById(booking.packageRef),
    User.findById(booking.userRef)
  ]);

  streamReceiptPdf(res, { receipt, booking, pkg, user });
});

export const exportReceiptsCsv = asyncHandler(async (req, res) => {
  // admin only, from/to optional
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;

  const filters = {};
  if (from || to) {
    filters.issuedAt = {};
    if (from) filters.issuedAt.$gte = from;
    if (to) filters.issuedAt.$lte = to;
  }

  const receipts = await Receipt.find(filters).populate({
    path: 'bookingRef',
    populate: [{ path: 'userRef', select: 'name email' }, { path: 'packageRef', select: 'title' }]
  }).sort('-issuedAt');

  const rows = receipts.map(r => ({
    receiptNo: r.receiptNo,
    amount: r.amount,
    currency: r.currency,
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus,
    issuedAt: r.issuedAt,
    bookingId: r.bookingRef?._id,
    customerName: r.bookingRef?.userRef?.name,
    customerEmail: r.bookingRef?.userRef?.email,
    packageTitle: r.bookingRef?.packageRef?.title,
  }));

  const csv = toCsv(rows, [
    'receiptNo', 'amount', 'currency', 'paymentMethod', 'paymentStatus', 'issuedAt',
    'bookingId', 'customerName', 'customerEmail', 'packageTitle'
  ]);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="receipts.csv"');
  res.send(csv);
});
