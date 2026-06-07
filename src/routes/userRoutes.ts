import express from 'express';
import { getMyProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getMyProfile);

export default router;