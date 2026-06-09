import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
// ড্যাশবোর্ড রাউট এবং কন্ট্রোলার ইমপোর্ট করুন (আপনার ফাইল স্ট্রাকচার অনুযায়ী পাথ চেক করুন)
import dashboardRoutes from './routes/dashboardRoutes.js'; 
import { protect, authorize } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// রাউটস
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "success", message: "Smart Task API running 🚀" });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ড্যাশবোর্ড রাউট (সবগুলো ড্যাশবোর্ড রিলেটেড রাউট এখানে থাকবে)
app.use('/api/dashboard', protect, dashboardRoutes);

// ✅ এরর হ্যান্ডলার
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});