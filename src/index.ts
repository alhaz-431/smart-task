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
import dashboardRoutes from './routes/dashboardRoutes.js'; 

// মিডলওয়্যার ইমপোর্ট
import { protect } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// ১. CORS কনফিগারেশন
const corsOptions = {
  origin: [
    "http://localhost:3000", 
    "https://front-smarttask-2o1k.vercel.app", 
    "https://front-smarttask-37lu.vercel.app" // এই নতুন লিঙ্কটি যোগ করুন
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// ২. অন্যান্য মিডলওয়্যার
app.use(express.json());
app.use(morgan('dev'));

// ৩. হোম রুট
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "success", message: "Smart Task API running 🚀" });
});

// ৪. এপিআই রাউটস (এগুলোই ঠিক আছে)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes); // আপনার ইউজার রাউট এখানে আছে
app.use('/api/activity-logs', activityRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

// ৫. গ্লোবাল এরর হ্যান্ডলার
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});