import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import apiRoutes from './api/routes';

const app = express();

// Enable CORS for all origins and HTTP methods including OPTIONS preflight
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.sendStatus(200);
});

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
