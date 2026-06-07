import { Request, Response } from 'express';
import prisma from '../db.js';

export const getMyProfile = async (req: any, res: Response) => {
  try {
    // protect মিডলওয়্যার থেকে পাওয়া user.id ব্যবহার করছি
    const userId = req.user.id; 
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true 
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};