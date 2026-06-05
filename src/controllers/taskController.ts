import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// টাস্ক তৈরি করা
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, deadline, projectId, assigneeId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        projectId,
        assigneeId: assigneeId || null, // এসাইনি আইডি না থাকলে null
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// টাস্ক স্ট্যাটাস আপডেট করা
export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Status enum থেকে ভ্যালু আসবে (TODO, IN_PROGRESS, COMPLETED)
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
};