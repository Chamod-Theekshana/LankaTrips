/**
 * OPTIONAL Stripe scaffold.
 * Leave Stripe keys empty to keep Stripe disabled.
 * When enabled: you can create PaymentIntent and update Receipt status.
 *
 * See Stripe docs for PaymentIntents.
 */
import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Create PaymentIntent (example for future)
router.post('/payment-intent', requireAuth, asyncHandler(async (req, res) => {
  if (!stripe) {
    res.status(400);
    throw new Error('Stripe is not configured');
  }

  const { amount, currency = 'lkr' } = req.body;
  const pi = await stripe.paymentIntents.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  });

  res.json({ success: true, data: { clientSecret: pi.client_secret }, message: 'PaymentIntent created' });
}));

export default router;
