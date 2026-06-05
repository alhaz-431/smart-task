import express from 'express';
import { createTask, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask); // টাস্ক তৈরি
router.patch('/:id/status', protect, updateTaskStatus); // স্ট্যাটাস আপডেট

export default router;