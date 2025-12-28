import { Router } from 'express';
import { listPackages, getPackage, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createPackageSchema, updatePackageSchema } from '../validations/packageSchemas.js';

const router = Router();

router.get('/', listPackages);
router.get('/:id', getPackage);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  upload.array('images', 8),
  validate(createPackageSchema),
  createPackage
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  upload.array('images', 8),
  validate(updatePackageSchema),
  updatePackage
);

router.delete('/:id', requireAuth, requireRole('admin'), deletePackage);

export default router;
