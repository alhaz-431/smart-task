import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(), // optional করে দাও যদি এটি না দিলেও চলে
  status: z.string().optional(),     // optional করে দাও
  deadline: z.string().datetime(),   // এটি ডেট ফরম্যাট চেক করবে
});