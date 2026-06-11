import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// স্ট্যাটাস ম্যাপিং (Prisma Enum এরর এড়াতে)
const statusMap: Record<string, any> = {
  "Todo": "TODO",
  "In Progress": "IN_PROGRESS",
  "Completed": "COMPLETED"
};

// ১. মেম্বারের নিজস্ব টাস্কগুলো পাওয়ার জন্য
export const getMyTasks = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { title: true } } }
    });

    const formattedTasks = tasks.map(task => ({
      ...task,
      projectName: task.project?.title || "No Project"
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    next(error);
  }
};

// ২. টাস্ক তৈরি করা
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

// ৩. টাস্ক স্ট্যাটাস আপডেট করা (ফিক্সড আইডি টাইপ)
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const prismaStatus = statusMap[status] || status;

    const task = await prisma.task.update({
      where: { id: id },
      data: { status: prismaStatus },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// ৪. ইউজার অ্যাসাইন করা (ফিক্সড আইডি টাইপ)
export const assignTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { assigneeId } = req.body;
    const task = await prisma.task.update({
      where: { id: id },
      data: { assigneeId }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign user" });
  }
};

// ৫. প্রায়োরিটি আপডেট করা (ফিক্সড আইডি টাইপ)
export const updateTaskPriority = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { priority } = req.body;
    const task = await prisma.task.update({
      where: { id: id },
      data: { priority }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update priority" });
  }
};

// ৬. প্রজেক্ট ভিত্তিক টাস্ক ফেচ করা
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const tasks = await prisma.task.findMany({
      where: { projectId: projectId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ৭. টাস্ক ডিলিট করা (ফিক্সড আইডি টাইপ)
export const deleteTask = async (req: any, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.task.delete({ where: { id: id } });

    await prisma.activityLog.create({
      data: {
        action: `Task deleted: ${id}`,
        userId: req.user.id,
      }
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ৮. সব টাস্ক দেখা
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { project: true, assignee: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all tasks" });
  }
};