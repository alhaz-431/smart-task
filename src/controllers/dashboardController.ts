import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ১. ড্যাশবোর্ডের পরিসংখ্যান
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeProjects = await prisma.project.count({
      where: { status: 'ACTIVE' } 
    });

    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' }
    });

    const pendingTasks = await prisma.task.count({
      where: { status: 'TODO' }
    });

    res.status(200).json({ activeProjects, completedTasks, pendingTasks });
  } catch (error) {
    next(error);
  }
};

// ২. রিসেন্ট টাস্কগুলো (assigneeId ব্যবহার করে)
export const getRecentTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id; 
    
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// ৩. সাম্প্রতিক অ্যাক্টিভিটিগুলো (timestamp ব্যবহার করে)
export const getDashboardActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activities = await prisma.activityLog.findMany({ 
      orderBy: { timestamp: 'desc' }, // আপনার মডেলে 'createdAt' নয়, 'timestamp' আছে
      take: 5,
    });
    
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};