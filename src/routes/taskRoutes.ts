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

const router = express.Router();

router.get('/', protect, getAllTasks);                          // ✅ restrictTo সরানো
router.post('/', protect, createTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/priority', protect, updateTaskPriority);
router.patch('/:id/assign', protect, assignTask);              // ✅ restrictTo সরানো

router.delete('/:id', protect, deleteTask);                    // ✅ restrictTo সরানো

router.get('/project/:projectId', protect, getTasksByProject);

export default router;