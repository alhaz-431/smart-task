import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js'; // authorize ইমপোর্ট করুন
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// বিদ্যমান সাধারণ রাউট
router.get('/me', protect, getMyProfile);
router.patch('/me', protect, updateMyProfile);

// --- নতুন এডমিন রাউটগুলো ---
// শুধুমাত্র এডমিনরা সব ইউজার দেখতে পারবে
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "ইউজার ডাটা আনতে সমস্যা হয়েছে" });
  }
});

router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({ 
      where: { id: req.params.id } 
    });
    res.json({ message: "ইউজার সফলভাবে ডিলিট হয়েছে" });
  } catch (error) {
    res.status(500).json({ error: "ইউজার ডিলিট করতে সমস্যা হয়েছে" });
  }
});

export default router;