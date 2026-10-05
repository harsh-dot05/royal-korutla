import { Router } from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/realEstateController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/real-estate', getProperties);
router.get('/real-estate/:id', getPropertyById);
router.post('/admin/real-estate', requireAdmin, createProperty);
router.put('/admin/real-estate/:id', requireAdmin, updateProperty);
router.delete('/admin/real-estate/:id', requireAdmin, deleteProperty);

export default router;
