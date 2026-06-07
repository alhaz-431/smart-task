import express from 'express';
import { 
  createTask, 
  updateTaskStatus, 
  assignTask, 
  updateTaskPriority,
  getTasksByProject,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { restrictTo } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// টাস্ক রুটস
router.post('/', protect, createTask);

// টাস্ক স্ট্যাটাস এবং প্রায়োরিটি সবাই (Manager/Member) আপডেট করতে পারবে
router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/priority', protect, updateTaskPriority);

// অ্যাসাইন করা এবং ডিলিট করার ক্ষমতা শুধু ম্যানেজারের
router.patch('/:id/assign', protect, restrictTo('MANAGER'), assignTask);
router.delete('/:id', protect, restrictTo('MANAGER'), deleteTask);

// প্রজেক্টের সব টাস্ক দেখা
router.get('/project/:projectId', protect, getTasksByProject);

export default router;