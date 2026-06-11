import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// রাউটস ইমপোর্ট
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; // একটি মাত্র ড্যাশবোর্ড রাউট

// মিডলওয়্যার ইমপোর্ট
import { protect } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://front-smarttask-2o1k.vercel.app", 
    "https://front-smarttask-37lu.vercel.app" 
  ],
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// এপিআই রাউটস
app.use('/api/auth', authRoutes);
app.use('/api/projects', protect, projectRoutes);
app.use('/api/tasks', protect, taskRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/activity-logs', protect, activityRoutes);

// আপনার ড্যাশবোর্ড রাউট (যেহেতু একটি ফাইলই ব্যবহার করছেন)
app.use('/api/dashboard', protect, dashboardRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});