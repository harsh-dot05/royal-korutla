import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/orderController';
import { requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createOrderSchema } from '../validators/orderValidator';

const router = Router();

router.post('/orders', validateBody(createOrderSchema), createOrder);
router.get('/admin/orders', requireAdmin, getOrders);

export default router;
