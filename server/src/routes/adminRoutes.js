import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { dashboard } from '../controllers/adminController.js';

const router = Router();

router.get('/dashboard', requireAuth, requireRole('admin'), dashboard);

export default router;
