import { Router } from 'express';
import { listLocations, getLocation, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createLocationSchema, updateLocationSchema } from '../validations/locationSchemas.js';

const router = Router();

router.get('/', listLocations);
router.get('/:id', getLocation);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validate(createLocationSchema),
  createLocation
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  upload.array('images', 6),
  validate(updateLocationSchema),
  updateLocation
);

router.delete('/:id', requireAuth, requireRole('admin'), deleteLocation);

export default router;
