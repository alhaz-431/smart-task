import { Request, Response, NextFunction } from 'express';

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user এখন টাইপস্ক্রিপ্ট চিনতে পারবে
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You do not have permission to perform this action" 
      });
    }
    next();
  };
};