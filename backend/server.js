require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const serviceManager = require('./services/serviceManager');
const errorHandler = require('./middleware/errorHandler');

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

// Import routes
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const analyticsRoutes = require('./routes/analytics');
const socialRoutes = require('./routes/social');
const hotspotsRoutes = require('./routes/hotspots');
const offlineRoutes = require('./routes/offline');
const healthRoutes = require('./routes/health');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/hotspots', hotspotsRoutes);
app.use('/api/offline', offlineRoutes);
app.use('/api/health', healthRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'AquaSutra Enhanced API is running!',
    version: '2.0.0',
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

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    availableEndpoints: [
      '/api/test',
      '/api/health',
      '/api/auth',
      '/api/reports',
      '/api/analytics',
      '/api/social',
      '/api/hotspots',
      '/api/offline'
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Initialize services and start server
async function startServer() {
  try {
    console.log('🌊 Starting AquaSutra Enhanced Ocean Safety Platform...');
    
    // Initialize all services
    await serviceManager.initialize();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}/api`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();