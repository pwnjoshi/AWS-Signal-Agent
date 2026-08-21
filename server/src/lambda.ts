import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import apiRoutes from './api/routes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AWS Signal Autonomous Intelligence Agent',
    briefings_url: '/api/briefings/latest',
    signals_url: '/api/signals',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AWS Signal Agent Lambda', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

export const handler = serverless(app);
