import express from 'express';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import cors from 'cors';
import { sportRouter } from './routes/sport.route';
import envConfig from './config/env.config';
import { authRouter } from './routes/auth.route';
import { matchRouter } from './routes/macth.route';
import WebSocket from 'ws';  // Import the ws package

// Declare global type for WebSocket server
declare global {
  var wss: WebSocket.Server;
}

// Initialize Prisma Client
export const prismaClient = new PrismaClient();

// Initialize Express App
const app = express();

// Middleware
app.use(morgan(envConfig.appMode === "production" ? "combined" : "dev"));
app.use(express.json());

app.use(
  cors({
    origin: envConfig.appMode === "production"
      ? ["https://ifgames.bsospace.com", "https://stagging-ifgames.bsospace.com",'http://localhost:3000']
      : "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Sports API',
  });
});

app.use('/api/v1', sportRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', matchRouter);

// Create HTTP server and attach it to ws WebSocket server
const server = http.createServer(app);

// Create WebSocket server using the 'ws' package
const wss = new WebSocket.Server({ server });
global.wss = wss;


// WebSocket Connection Logic
wss.on('connection', (ws) => {
  console.log('[INFO] New WebSocket connection established.');

  ws.send(`Hello World,🎉👋`); 
  // Handle incoming messages from the client
  ws.on('message', (data) => {
    console.log('[INFO] Received WebSocket message:', data);
    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data); // Send the data to all clients
      }
    });
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('[INFO] WebSocket connection closed.');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('[ERROR] WebSocket error:', error);
  });
});

// Start the server
const appPort = envConfig.appPort || 5058;
server.listen(appPort, () => {
  console.log(`[INFO] Server is running on http://localhost:${appPort}`);
});

// Handle 404 Errors
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Route not found for ${req.method} ${req.path}`,
  });
});
