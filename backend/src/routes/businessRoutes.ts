import { Router } from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '../controllers/businessController';
import { requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createBusinessSchema, updateBusinessSchema } from '../validators/businessValidator';

const router = Router();

router.get('/businesses', getBusinesses);
router.get('/businesses/:id', getBusinessById);
router.post('/businesses', requireAdmin, validateBody(createBusinessSchema), createBusiness);
router.put('/businesses/:id', requireAdmin, validateBody(updateBusinessSchema), updateBusiness);
router.delete('/businesses/:id', requireAdmin, deleteBusiness);

export default router;
