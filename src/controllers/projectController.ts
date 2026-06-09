import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { createProjectSchema } from '../validators/projectValidator.js';

const prisma = new PrismaClient();

// ১. প্রজেক্ট তৈরি (Create)
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ভ্যালিডেশন চেক (Zod এর সঠিক এরর হ্যান্ডলিং)
    const validation = createProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
    }

    const { title, description, deadline } = validation.data;
    const userId = (req as any).user.id; 

    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        status: ProjectStatus.ACTIVE, 
        deadline: new Date(deadline),
        userId: userId, 
      },
    });
    
    res.status(201).json(project);
  } catch (error) {
    next(error); 
  }
};

// ২. সব প্রজেক্ট দেখা (Get All)
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const projects = await prisma.project.findMany({
      where: { userId: userId }, 
      include: { tasks: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// ৩. প্রজেক্ট আপডেট করা (Update)
export const updateProject = async (req: Request, res: Response) => {
  const id = req.params.id as string; // টাইপ নিশ্চিত করা হলো
  const { title, description, status, deadline } = req.body;
  
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status: status as ProjectStatus, 
        deadline: deadline ? new Date(deadline) : undefined
      }
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(404).json({ error: 'Project not found or update failed' });
  }
};

// ৪. প্রজেক্ট ডিলিট করা (Delete)
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // টাইপ নিশ্চিত করা হলো
    await prisma.project.delete({ 
      where: { id } 
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};

// ৫. আইডি দিয়ে প্রজেক্ট দেখা (Get by ID)
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // টাইপ নিশ্চিত করা হলো
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true } 
    });

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
};