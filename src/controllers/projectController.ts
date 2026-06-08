import { Request, Response } from 'express';
import prisma from '../db.js';
import {  NextFunction } from 'express'; // NextFunction এখানে যোগ করো
import { createProjectSchema } from '../validators/projectValidator.js'; // এটি তোমার ভ্যালিডেশন স্কিমা ফাইল

export const createProject = async (req: any, res: Response, next: NextFunction) => { // next প্যারামিটারটি যোগ করো
  try {
    // ১. ভ্যালিডেশন চেক (এটিই সব ডাটা চেক করবে)
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: result.error.issues 
      });
    }

    // ২. ভ্যালিডেশন পাস করলে এখান থেকে ডাটা নাও
    const { title, description, status, deadline } = result.data;
    const userId = req.user.id; 

    // ৩. ডাটাবেসে সেভ করো
    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        status: status || 'PENDING',
        deadline: new Date(deadline),
        userId: userId, 
      },
    });
    
    res.status(201).json(project);
  } catch (error) {
    next(error); // গ্লোবাল এরর হ্যান্ডলার ব্যবহার করলে এভাবে পাঠাও
  }
};

export const getAllProjects = async (req: any, res: Response) => {
  try {
    // এখানে req.user.id তখনই কাজ করবে যদি আপনার middleware এ user সেট করা থাকে
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id }, 
      include: { tasks: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
// ৩. প্রজেক্ট ডিলিট করা (Delete)
export const deleteProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.project.delete({ 
      where: { id: id } 
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};

// ৪. প্রজেক্ট আপডেট করা (Update)
export const updateProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, description, status, deadline } = req.body;
  
  try {
    const dataToUpdate: any = { title, description, status };
    if (deadline) {
      dataToUpdate.deadline = new Date(deadline);
    }

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: dataToUpdate
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(404).json({ error: 'Project not found or update failed' });
  }
};

// ৫. আইডি দিয়ে প্রজেক্ট দেখা (Get by ID)
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id:id },
      include: { tasks: true } 
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};