import { Router } from 'express';
import { getHospitals, getDoctors, createHospital, createDoctor, deleteHospital, deleteDoctor } from '../controllers/hospitalController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/hospitals', getHospitals);
router.get('/doctors', getDoctors);
router.post('/admin/hospitals', requireAdmin, createHospital);
router.post('/admin/doctors', requireAdmin, createDoctor);
router.delete('/admin/hospitals/:id', requireAdmin, deleteHospital);
router.delete('/admin/doctors/:id', requireAdmin, deleteDoctor);

export default router;
