import express from 'express';
import { 
  createTask, 
  updateTaskStatus, 
  assignTask, 
  updateTaskPriority 
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// টাস্ক রুটস
router.post('/', protect, createTask);
router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/assign', protect, assignTask);
router.patch('/:id/priority', protect, updateTaskPriority);

export default router;