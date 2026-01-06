import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema } from '../validations/bookingSchemas.js';
import { createBooking, listMyBookings, listAllBookings, updateBookingStatus } from '../controllers/bookingController.js';

const router = Router();

// customer
router.post('/', requireAuth, requireRole('customer', 'admin'), validate(createBookingSchema), createBooking);
router.get('/me', requireAuth, listMyBookings);

// admin
router.get('/', requireAuth, requireRole('admin'), listAllBookings);
router.patch('/:id/status', requireAuth, requireRole('admin'), updateBookingStatus);

export default router;
