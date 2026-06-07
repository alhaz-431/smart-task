import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { protect, authorize } from './middlewares/authMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';
const app = express();

app.use(express.json());

// ✅ ROOT FIRST (important for clarity)
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Smart Task API running 🚀"
  });
});

// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
// ✅ PROTECTED ROUTES
app.get('/api/admin', protect, authorize('ADMIN'), (req: Request, res: Response) => {
  res.json({ message: 'Welcome Admin' });
});

app.get('/api/dashboard', protect, authorize('MEMBER', 'MANAGER', 'ADMIN'), (req: Request, res: Response) => {
  res.json({ message: 'Welcome to your Dashboard' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});