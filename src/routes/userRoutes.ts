// routes/userRoutes.js
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// সব ইউজার পাওয়ার জন্য রুট (এটি এখন /api/users হিসেবে কাজ করবে)
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "ইউজার ডাটা আনতে সমস্যা হয়েছে" });
  }
});

// নতুন ইউজার বা মেম্বার যোগ করার জন্য POST রুট (এটি আপনার Add Member এর জন্য জরুরি)
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const newUser = await prisma.user.create({ data: { name, email, role } });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "মেম্বার তৈরি করা যায়নি" });
    }
});

router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "ইউজার ডিলিট হয়েছে" });
  } catch (error) {
    res.status(500).json({ error: "ডিলিট করতে সমস্যা হয়েছে" });
  }
});

export default router;