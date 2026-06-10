import express from 'express';
import { 
  createTask, 
  updateTaskStatus, 
  assignTask, 
  updateTaskPriority,
  getTasksByProject,
  deleteTask,
  getAllTasks
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { restrictTo } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.post('/', protect, createTask);


router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/priority', protect, updateTaskPriority);


router.patch('/:id/assign', protect, restrictTo('MANAGER'), assignTask);
router.delete('/:id', protect, restrictTo('MANAGER'), deleteTask);
router.get('/', protect, restrictTo('ADMIN'), getAllTasks);

router.get('/project/:projectId', protect, getTasksByProject);

export default router;