import { Router } from 'express';
import { loginAdmin, getAdminMe, logoutAdmin } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { adminLoginSchema } from '../validators/authValidator';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/admin/login', validateBody(adminLoginSchema), loginAdmin);
router.get('/admin/me', requireAdmin, getAdminMe);
router.post('/admin/logout', logoutAdmin);

export default router;
