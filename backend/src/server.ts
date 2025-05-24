import 'module-alias/register';

import { connectDB } from '@lib/db';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from './routes/auth.route';

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  connectDB();
});
