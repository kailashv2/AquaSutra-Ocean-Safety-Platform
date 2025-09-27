// Simple test server to identify the issue
console.log('Starting test server...');

try {
  require('dotenv').config();
  console.log('✅ dotenv loaded');

  const express = require('express');
  console.log('✅ express loaded');

  const cors = require('cors');
  console.log('✅ cors loaded');

  const http = require('http');
  console.log('✅ http loaded');

  const socketIo = require('socket.io');
  console.log('✅ socket.io loaded');

  // Test database connection
  const db = require('./config/db');
  console.log('✅ database config loaded');

  // Test service manager
  const serviceManager = require('./services/serviceManager');
  console.log('✅ service manager loaded');

  console.log('All modules loaded successfully!');

  // Simple express app
  const app = express();
  const server = http.createServer(app);

  app.get('/test', (req, res) => {
    res.json({ message: 'Test server working!' });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
