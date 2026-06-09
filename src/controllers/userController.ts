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

// ১. নতুন মেম্বার যোগ করার জন্য
export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    // পাসওয়ার্ড ফিল্ডটি অপশনাল হওয়ায় সরাসরি ডাটা ইনসার্ট করা যাবে
    const user = await prisma.user.create({ 
      data: { 
        name, 
        email, 
        role: role || "MEMBER" // যদি রোল না দেওয়া থাকে, ডিফল্ট MEMBER সেট হবে
      } 
    });

    res.status(201).json(user);
  } catch (error: any) {
    // ইমেইল ইউনিক না হলে বা অন্য কোন ডাটাবেস এরর হলে এটি ধরবে
    res.status(500).json({ error: "Failed to add user: " + error.message });
  }
};

// ২. মেম্বার এডিট করার জন্য
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: { id: String(id) }, // id কে নিশ্চিতভাবে String করা হলো
      data: { 
        name, 
        email, 
        role 
      }
    });

    res.json(user);
  } catch (error: any) {
    // ইউজার খুঁজে না পাওয়া গেলে বা আপডেট এরর হলে এটি ধরবে
    res.status(500).json({ error: "Failed to update user: " + error.message });
  }
};