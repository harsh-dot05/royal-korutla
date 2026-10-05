import { Router } from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/admin/jobs', requireAdmin, createJob);
router.put('/admin/jobs/:id', requireAdmin, updateJob);
router.delete('/admin/jobs/:id', requireAdmin, deleteJob);

export default router;
