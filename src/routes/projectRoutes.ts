import express from 'express';
import { 
  createProject, 
  getAllProjects, 
  deleteProject, 
  updateProject // <-- এখানে ইমপোর্ট করো
} from '../controllers/projectController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllProjects);
router.post('/', protect, authorize('ADMIN', 'MANAGER'), createProject);
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

// আপডেট রাউট
router.put('/:id', protect, authorize('ADMIN', 'MANAGER'), updateProject);

export default router;