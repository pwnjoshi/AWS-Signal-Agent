import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import apiRoutes from './api/routes';

const app = express();

// Only use Express cors middleware when running locally
// In AWS Lambda, Lambda Function URL native CORS handles headers at the gateway layer to avoid duplicate headers
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }));
}

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
