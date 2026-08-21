import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api/routes';
import { initScheduler } from './scheduler/agentScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Prefix
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AWS Signal Agent', timestamp: new Date().toISOString() });
});

// Start Express server and initialize background scheduler
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 AWS Signal Autonomous Intelligence Agent Server  `);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);

  // Initialize scheduler
  initScheduler();
});
