import { Router } from 'express';
import authRoutes from './authRoutes';
import homeRoutes from './homeRoutes';
import businessRoutes from './businessRoutes';
import photographyRoutes from './photographyRoutes';
import promotionRoutes from './promotionRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

router.use('/api', authRoutes);
router.use('/api', homeRoutes);
router.use('/api', businessRoutes);
router.use('/api', photographyRoutes);
router.use('/api', promotionRoutes);
router.use('/api', orderRoutes);

export default router;
