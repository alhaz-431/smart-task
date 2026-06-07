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

// ১. প্রজেক্টগুলো দেখার রুট (সব লগইন করা ইউজার দেখতে পাবে)
router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectById);

// ২. প্রজেক্ট তৈরির রুট (শুধু ADMIN এবং MANAGER পারবে)
router.post('/', protect, authorize('ADMIN', 'MANAGER'), createProject);

// ৩. প্রজেক্ট আপডেট করার রুট (শুধু ADMIN এবং MANAGER পারবে)
// এখানে PATCH বা PUT ব্যবহার করতে পারো, আমি এখানে PUT রাখলাম তোমার আগের কোড অনুযায়ী
router.put('/:id', protect, authorize('ADMIN', 'MANAGER'), updateProject);

// ৪. প্রজেক্ট ডিলিট করার রুট (শুধু ADMIN পারবে)
router.delete('/:id', protect, authorize('ADMIN'), deleteProject);

export default router;