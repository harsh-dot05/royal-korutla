import { Router } from 'express';
import {
  createReelRequest,
  getReelRequests,
  updateReelRequest,
  deleteReelRequest,
} from '../controllers/reelRequestController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Public: Submit a reel request
router.post('/reel-requests', createReelRequest);

// Admin: View and manage reel requests
router.get('/admin/reel-requests', requireAdmin, getReelRequests);
router.patch('/admin/reel-requests/:id', requireAdmin, updateReelRequest);
router.delete('/admin/reel-requests/:id', requireAdmin, deleteReelRequest);

export default router;
