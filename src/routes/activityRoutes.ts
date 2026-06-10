import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', protect, async (req, res) => {  // ✅ authorize সরানো
  try {
    const logs = await prisma.activityLog.findMany({ 
      include: { user: true },
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "অ্যাক্টিভিটি লগ আনতে সমস্যা হয়েছে" });
  }
});

export default router;