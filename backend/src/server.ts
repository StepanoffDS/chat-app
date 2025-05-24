import 'module-alias/register';
import express from 'express';
import authRoutes from './routes/auth.route';

const app = express();
const PORT = 5001;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
