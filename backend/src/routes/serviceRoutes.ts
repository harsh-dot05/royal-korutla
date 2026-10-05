import { Router } from 'express';
import {
  getServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  createServiceRequest,
  getServiceRequests,
} from '../controllers/serviceController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/services', getServiceProviders);
router.post('/services/request', createServiceRequest);
router.post('/admin/services', requireAdmin, createServiceProvider);
router.put('/admin/services/:id', requireAdmin, updateServiceProvider);
router.delete('/admin/services/:id', requireAdmin, deleteServiceProvider);
router.get('/admin/service-requests', requireAdmin, getServiceRequests);

export default router;
