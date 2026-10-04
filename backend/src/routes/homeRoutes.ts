import { Router } from 'express';
import { getHomepagePayload } from '../controllers/homeController';

const router = Router();

router.get('/home', getHomepagePayload);

export default router;
