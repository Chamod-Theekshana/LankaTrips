import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler.js';
import User from '../models/User.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized (missing token)');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized (user not found)');
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    throw new Error('Not authorized (invalid token)');
  }
});
