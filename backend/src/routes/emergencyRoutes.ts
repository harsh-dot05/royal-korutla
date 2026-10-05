import { Router } from 'express';
import { getEmergencyContacts, createEmergencyContact, deleteEmergencyContact } from '../controllers/emergencyController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/emergency', getEmergencyContacts);
router.post('/admin/emergency', requireAdmin, createEmergencyContact);
router.delete('/admin/emergency/:id', requireAdmin, deleteEmergencyContact);

export default router;
