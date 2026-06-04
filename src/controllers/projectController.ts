import { Request, Response } from 'express';
import prisma from '../db.js';

// ১. প্রজেক্ট তৈরি (Create)
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    
    // ডাটাবেসে প্রজেক্ট ক্রিয়েট
    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        status: status || 'PENDING' 
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// ২. সব প্রজেক্ট দেখা (View All)
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({ 
      include: { tasks: true } // প্রজেক্টের সাথে টাস্কগুলোও চলে আসবে
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// ৩. প্রজেক্ট ডিলিট করা (Delete) - এখানে আইডি কাস্টিং করা হয়েছে
export const deleteProject = async (req: Request, res: Response) => {
  // TypeScript এরর এড়াতে 'as string' ব্যবহার করা হয়েছে
  const id = req.params.id as string;
  
  try {
    await prisma.project.delete({ 
      where: { id: id } 
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Project not found or could not be deleted' });
  }
};

// ৪. প্রজেক্ট আপডেট করা (Update) - এটি তোমার দরকার হবে
export const updateProject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, description, status } = req.body;
  
  try {
    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: { title, description, status }
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
};