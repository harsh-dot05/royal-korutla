import { Router } from 'express';
import { getHomepagePayload, getCategories, getStats } from '../controllers/homeController';

const router = Router();

router.get('/home', getHomepagePayload);
router.get('/categories', getCategories);
router.get('/stats', getStats);

export default router;
