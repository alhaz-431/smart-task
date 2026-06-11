import express from 'express';
import { getStats, getRecentTasks, getDashboardActivity } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// এখানে সবগুলো রাউট যোগ করুন
router.get('/stats', protect, getStats);
router.get('/recent-tasks', protect, getRecentTasks);
router.get('/activity', protect, getDashboardActivity);

export default router;