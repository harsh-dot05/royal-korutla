import { Router } from 'express';
import {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  deletePromotion,
} from '../controllers/promotionController';
import { requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createPromotionSchema } from '../validators/promotionValidator';

const router = Router();

router.get('/promotions', getActivePromotions);
router.get('/admin/promotions', requireAdmin, getAllPromotions);
router.post('/admin/promotions', requireAdmin, validateBody(createPromotionSchema), createPromotion);
router.delete('/admin/promotions', requireAdmin, deletePromotion);

export default router;
