import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { 
  listMyReceipts, 
  listAllReceipts, 
  getReceipt, 
  downloadReceiptPdf, 
  exportReceiptsCsv 
} from '../controllers/receiptController.js';

const router = Router();

// Customer routes
router.get('/me', requireAuth, listMyReceipts);
router.get('/:id/pdf', requireAuth, downloadReceiptPdf);

// Admin routes
router.get('/', requireAuth, requireRole('admin'), listAllReceipts);
router.get('/export/csv', requireAuth, requireRole('admin'), exportReceiptsCsv);
router.get('/:id', requireAuth, getReceipt);

export default router;