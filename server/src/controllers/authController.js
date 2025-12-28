import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'customer' });

  const token = signToken(user._id);
  return ok(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Registered');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = signToken(user._id);
  return ok(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Logged in');
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, req.user, 'Me');
});
