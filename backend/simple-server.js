require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'AquaSutra Enhanced API is running!',
    version: '2.0.0',
    status: 'Database connection will be established when PostgreSQL is available',
    features: [
      'Enhanced Role-Based Access Control',
      'Social Media Integration with NLP',
      'Dynamic Hotspot Generation',
      'Multilingual Support',
      'Offline Data Synchronization',
      'Early Warning System Integration'
    ],
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      api: 'running',
      database: 'not connected - PostgreSQL required',
      socketio: 'running'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`Client ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    availableEndpoints: [
      '/api/test',
      '/api/health'
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log('🌊 AquaSutra Enhanced Ocean Safety Platform');
  console.log('==========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('');
  console.log('⚠️  Note: Database features require PostgreSQL with PostGIS');
  console.log('   Install PostgreSQL and configure connection to enable full features');
  console.log('==========================================');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
