import express from 'express';
import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
  getProjectById,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, createProject);          // authorize সরানো হয়েছে
router.put('/:id', protect, updateProject);        // authorize সরানো হয়েছে
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

export default router;