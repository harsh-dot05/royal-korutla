import { Router } from 'express';
import {
  getPhotographyStudios,
  createPhotographyStudio,
  updatePhotographyStudio,
  deletePhotographyStudio,
} from '../controllers/photographyController';
import { requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createPhotographySchema, updatePhotographySchema } from '../validators/photographyValidator';

const router = Router();

router.get('/photography', getPhotographyStudios);
router.get('/admin/photography', requireAdmin, getPhotographyStudios);
router.post('/admin/photography', requireAdmin, validateBody(createPhotographySchema), createPhotographyStudio);
router.put('/admin/photography', requireAdmin, validateBody(updatePhotographySchema), updatePhotographyStudio);
router.delete('/admin/photography', requireAdmin, deletePhotographyStudio);

export default router;
