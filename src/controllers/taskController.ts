import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// টাস্ক তৈরি করা
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, projectId, assigneeId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        projectId,
        assigneeId: assigneeId || null,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// টাস্ক স্ট্যাটাস আপডেট করা
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    // আইডিটিকে স্ট্রিং হিসেবে নিশ্চিত করা হয়েছে
    const id = req.params.id as string;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// টাস্কে ইউজার অ্যাসাইন করা
export const assignTask = async (req: Request, res: Response) => {
  try {
    // আইডিটিকে স্ট্রিং হিসেবে নিশ্চিত করা হয়েছে
    const id = req.params.id as string;
    const { assigneeId } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { assigneeId }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign user" });
  }
};


export const updateTaskPriority = async (req: Request, res: Response) => {
  try {
   
    const id = req.params.id as string;
    const { priority } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { priority }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update priority" });
  }
};


export const getTasksByProject = async (req: Request, res: Response) => {
  try {
 
    const projectId = req.params.projectId as string; 
    
    const tasks = await prisma.task.findMany({
      where: { 
        projectId: projectId 
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // ১. প্রথমে টাস্কটি ডিলিট করুন
    await prisma.task.delete({ where: { id } });

    // ২. এবার লগ সেভ করুন (আপনার দেওয়া কোডটি এখানে বসবে)
    await prisma.activityLog.create({
      data: {
        action: `Task deleted: ${id}`, // ডাইনামিক অ্যাকশন টেক্সট
        userId: req.user.id,          // মিডলওয়্যার থেকে পাওয়া ইউজারের আইডি
      }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};