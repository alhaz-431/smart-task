import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// সাইনআপ ফাংশন
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) 
      return res.status(400).json({ error: 'Required fields missing' });

    // রোল ম্যাপ করা
    let mappedRole = 'MEMBER';
    if (role === 'admin') mappedRole = 'ADMIN';
    else if (role === 'manager') mappedRole = 'MANAGER';
    else mappedRole = 'MEMBER';

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role: mappedRole as any 
      },
    });

    res.status(201).json({ 
      message: 'User created', 
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    if (error.code === 'P2002') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// লগইন ফাংশন
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // ইউজার খুঁজে বের করা
    const user = await prisma.user.findUnique({ where: { email } });

    // ইউজার বা পাসওয়ার্ড না থাকলে এরর দেওয়া
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // পাসওয়ার্ড মিল চেক করা
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWT টোকেন তৈরি করা
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // সফল রেসপন্স
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, role: user.role } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
};