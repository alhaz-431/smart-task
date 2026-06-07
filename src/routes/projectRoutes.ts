import express from 'express';
import { 
  createProject, 
  getAllProjects, 
  deleteProject, 
  updateProject,
   getProjectById 
} from '../controllers/projectController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllProjects);
router.post('/', protect, authorize('ADMIN', 'MANAGER'), createProject);
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);
router.get('/:id', protect, getProjectById);
router.get('/', protect, getAllProjects);
router.put('/:id', protect, authorize('ADMIN', 'MANAGER'), updateProject);

export default router;