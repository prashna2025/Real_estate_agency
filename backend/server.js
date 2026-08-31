import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is required');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

const app = express();
const port = Number(process.env.PORT) || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/users', userRoutes);

app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Database unavailable: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
};

startServer();

export default app;