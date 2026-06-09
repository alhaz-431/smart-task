import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ১. অ্যাক্টিভ প্রজেক্ট (এখানে 'ACTIVE' স্ট্রিং ব্যবহার করে টাইপ কাস্টিং করা হয়েছে)
    const activeProjects = await prisma.project.count({
      where: { status: 'ACTIVE' as any } 
    });

    // ২. কমপ্লিট হওয়া টাস্ক 
    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' as any }
    });

    // ৩. টাস্ক (TODO স্ট্যাটাস)
    const pendingTasks = await prisma.task.count({
      where: { status: 'TODO' as any }
    });

    res.status(200).json({
      activeProjects,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    next(error);
  }
};