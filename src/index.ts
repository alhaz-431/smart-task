import 'dotenv/config'; 
import express from 'express';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { protect, authorize } from './middlewares/authMiddleware.js';

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 4000;

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/admin', protect, authorize('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

app.get('/api/dashboard', protect, authorize('MEMBER', 'MANAGER', 'ADMIN'), (req, res) => {
  res.json({ message: 'Welcome to your Dashboard' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});