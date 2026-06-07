import { Request, Response } from 'express';
import prisma from '../db.js';

// নিজের প্রোফাইল দেখা
export const getMyProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id; 
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// প্রোফাইল আপডেট করা
export const updateMyProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};