import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const signup = async (req: Request, res: Response) => {
  try {
    // 'name' ফিল্ডটি এখানে যোগ করা হয়েছে
    const { name, email, password, role } = req.body;

    // ভ্যালিডেশন: নাম, ইমেইল বা পাসওয়ার্ড মিসিং কি না চেক করা
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        name, // নতুন ফিল্ড এখানে ডাটাবেসে যাবে
        email, 
        password: hashedPassword, 
        role: role || 'MEMBER' 
      },
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    // ইমেইল ইউনিক হলে তার এরর হ্যান্ডলিং
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Login successful',
      token, 
      user: { id: user.id, name: user.name, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};