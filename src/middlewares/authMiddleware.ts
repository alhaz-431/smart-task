import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ১. Protect Middleware (লগইন আছে কি না তা যাচাই করে)
export const protect = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // টোকেন থেকে ইউজার ডাটা (id, role) এখানে সেট হচ্ছে
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ২. Authorize Middleware (ইউজারের রোল চেক করে)
export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // এখানে req.user.role চেক করা হচ্ছে
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "আপনার এডমিন এক্সেস নেই!" });
    }
    next();
  };
};