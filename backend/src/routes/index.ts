import { Router } from 'express';
import authRoutes from './authRoutes';
import homeRoutes from './homeRoutes';
import businessRoutes from './businessRoutes';
import photographyRoutes from './photographyRoutes';
import promotionRoutes from './promotionRoutes';
import orderRoutes from './orderRoutes';
import jobRoutes from './jobRoutes';
import realEstateRoutes from './realEstateRoutes';
import hospitalRoutes from './hospitalRoutes';
import serviceRoutes from './serviceRoutes';
import offerRoutes from './offerRoutes';
import emergencyRoutes from './emergencyRoutes';

const router = Router();

router.use('/api', authRoutes);
router.use('/api', homeRoutes);
router.use('/api', businessRoutes);
router.use('/api', photographyRoutes);
router.use('/api', promotionRoutes);
router.use('/api', orderRoutes);
router.use('/api', jobRoutes);
router.use('/api', realEstateRoutes);
router.use('/api', hospitalRoutes);
router.use('/api', serviceRoutes);
router.use('/api', offerRoutes);
router.use('/api', emergencyRoutes);

export default router;
