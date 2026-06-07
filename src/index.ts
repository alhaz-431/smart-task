import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors'; // এটি অবশ্যই ইন্সটল করে নেবে: npm install cors
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { protect, authorize } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// ✅ ১. মিডলওয়্যারসমূহ (সব রাউটের আগে থাকবে)
app.use(cors()); // Cross-Origin Resource Sharing এনাবল করা
app.use(express.json());
app.use(morgan('dev')); // লগিং সবার উপরে রাখা ভালো

// ✅ ২. রাউটস
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "success", message: "Smart Task API running 🚀" });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ✅ ৩. প্রোটেক্টেড রাউটস
app.get('/api/admin', protect, authorize('ADMIN'), (req: Request, res: Response) => {
  res.json({ message: 'Welcome Admin' });
});

app.get('/api/dashboard', protect, authorize('MEMBER', 'MANAGER', 'ADMIN'), (req: Request, res: Response) => {
  res.json({ message: 'Welcome to your Dashboard' });
});

// ✅ ৪. গ্লোবাল এরর হ্যান্ডলার (সবশেষে)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});