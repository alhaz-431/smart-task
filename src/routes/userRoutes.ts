import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // পাসওয়ার্ড হ্যাশ করার জন্য জরুরি

const router = express.Router();
const prisma = new PrismaClient();

// ১. GET All Users
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "ইউজার ডাটা আনতে সমস্যা হয়েছে" });
  }
});

// ২. POST (Add Member) - পাসওয়ার্ডের ডিফল্ট ভ্যালু যুক্ত করা হয়েছে
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const hashedPassword = await bcrypt.hash('123456', 10); // ডিফল্ট পাসওয়ার্ড সেট করে দেওয়া
    const newUser = await prisma.user.create({ 
        data: { name, email, role: role.toUpperCase(), password: hashedPassword } 
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "মেম্বার তৈরি করা যায়নি" });
  }
});

// ৩. PATCH (Edit Member) - এটি মিসিং ছিল
router.patch('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role: role.toUpperCase() },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "আপডেট করা যায়নি" });
  }
});



router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "ইউজার সফলভাবে ডিলিট হয়েছে" });
  } catch (error) {
    res.status(500).json({ error: "ডিলিট করতে সমস্যা হয়েছে" });
  }
});

export default router;