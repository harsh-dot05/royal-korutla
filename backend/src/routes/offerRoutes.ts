import { Router } from 'express';
import { getOffers, createOffer, deleteOffer } from '../controllers/offerController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/offers', getOffers);
router.post('/admin/offers', requireAdmin, createOffer);
router.delete('/admin/offers/:id', requireAdmin, deleteOffer);

export default router;
