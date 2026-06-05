import express from 'express';
import { createTask, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.patch('/:id/status', protect, updateTaskStatus);

export default router;