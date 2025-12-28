import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { listMyReceipts, listAllReceipts, getReceipt, downloadReceiptPdf, exportReceiptsCsv } from '../controllers/receiptController.js';

const router = Router();

// customer
router.get('/me', requireAuth, listMyReceipts);

// admin lists + export
router.get('/', requireAuth, requireRole('admin'), listAllReceipts);
router.get('/export/csv', requireAuth, requireRole('admin'), exportReceiptsCsv);

// shared (admin or owner)
router.get('/:id', requireAuth, getReceipt);
router.get('/:id/pdf', requireAuth, downloadReceiptPdf);

export default router;
