import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// অ্যাক্টিভিটি লগ দেখার রাউট (শুধুমাত্র এডমিনদের জন্য)
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({ 
      include: { user: true },
      orderBy: { timestamp: 'desc' } // নতুন লগগুলো আগে দেখাবে
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "অ্যাক্টিভিটি লগ আনতে সমস্যা হয়েছে" });
  }
});

export default router;