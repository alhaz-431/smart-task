import { Request, Response } from 'express';
import prisma from '../db.js';

// ১. প্রজেক্ট তৈরি (Create)
export const createProject = async (req: Request, res: Response) => {
  try {
    // deadline ফিল্ডটি যোগ করা হয়েছে
    const { title, description, status, deadline } = req.body;
    
    // ভ্যালিডেশন: টাইটেল চেক করা
    if (!title || !deadline) {
      return res.status(400).json({ error: 'Title and Deadline are required' });
    }

    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        status: status || 'PENDING',
        deadline: new Date(deadline), // স্ট্রিং থেকে ডেটে রূপান্তর
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// ২. সব প্রজেক্ট দেখা (View All)
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({ 
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