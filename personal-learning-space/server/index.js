import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import subjectRoutes from './routes/subjectRoutes.js';
import recallRoutes from './routes/recallRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import bugRoutes from './routes/bugRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${req.method}] ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/subjects', subjectRoutes);
app.use('/api/subjects/:id/recall', recallRoutes);
app.use('/api/subjects/:id/practice', practiceRoutes);
app.use('/api/subjects/:id/quizzes', quizRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Personal Learning Space API'
  });
});

// Serve frontend in production if built
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      next();
    }
  });
});

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Personal Learning Space Backend listening on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/health`);
});
