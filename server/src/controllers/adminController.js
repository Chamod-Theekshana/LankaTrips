import Booking from '../models/Booking.js';
import Receipt from '../models/Receipt.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  const [totalBookings, pendingBookings, confirmedBookings, completedBookings] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'completed' }),
  ]);

  const revenueAgg = await Receipt.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, revenue: { $sum: '$amount' } } }
  ]);

  const revenue = revenueAgg[0]?.revenue || 0;

  return ok(res, {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    revenue
  }, 'Admin dashboard');
});
