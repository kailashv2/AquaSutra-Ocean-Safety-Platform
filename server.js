require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const { OAuth2Client } = require('google-auth-library');

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'aquasutra-ocean-safety-2024';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/auth/google/callback`
);

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Initialize SQLite Database
const db = new sqlite3.Database('./aquasutra.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Database initialization
function initializeDatabase() {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        social_id TEXT,
        provider TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Add social login columns to existing table if they don't exist
    db.run(`ALTER TABLE users ADD COLUMN social_id TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.log('Note: social_id column may already exist');
        }
    });
    
    db.run(`ALTER TABLE users ADD COLUMN provider TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.log('Note: provider column may already exist');
        }
    });

    // Ocean monitoring data
    db.run(`CREATE TABLE IF NOT EXISTS ocean_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        wave_height REAL,
        water_temperature REAL,
        wind_speed REAL,
        visibility REAL,
        risk_level TEXT DEFAULT 'low',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Emergency alerts
    db.run(`CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        status TEXT DEFAULT 'active',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
    )`);

    // Hazard reports
    db.run(`CREATE TABLE IF NOT EXISTS hazard_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_name TEXT NOT NULL,
        reporter_email TEXT NOT NULL,
        hazard_type TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        severity TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample data
    insertSampleData();
}

// Insert sample ocean monitoring data
function insertSampleData() {
    // Wait a bit to ensure tables are created
    setTimeout(() => {
        const sampleLocations = [
            { name: 'Mumbai Coast', lat: 19.0760, lng: 72.8777 },
            { name: 'Chennai Marina', lat: 13.0827, lng: 80.2707 },
            { name: 'Goa Beaches', lat: 15.2993, lng: 74.1240 },
            { name: 'Kerala Backwaters', lat: 9.9312, lng: 76.2673 },
            { name: 'Andaman Islands', lat: 11.7401, lng: 92.6586 }
        ];

        sampleLocations.forEach(location => {
            const waveHeight = (Math.random() * 3 + 0.5).toFixed(1);
            const waterTemp = (Math.random() * 10 + 20).toFixed(1);
            const windSpeed = (Math.random() * 20 + 5).toFixed(1);
            const visibility = (Math.random() * 10 + 5).toFixed(1);
            const riskLevel = waveHeight > 2.5 ? 'high' : waveHeight > 1.5 ? 'medium' : 'low';

            db.run(`INSERT OR IGNORE INTO ocean_data 
                (location, latitude, longitude, wave_height, water_temperature, wind_speed, visibility, risk_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [location.name, location.lat, location.lng, waveHeight, waterTemp, windSpeed, visibility, riskLevel],
                function(err) {
                    if (err) {
                        console.log('Sample data insertion error:', err.message);
                    }
                }
            );
        });

        // Sample alerts
        const sampleAlerts = [
            {
                title: 'High Wave Alert',
                description: 'Dangerous wave conditions detected. Avoid water activities.',
                severity: 'high',
                location: 'Mumbai Coast',
                lat: 19.0760,
                lng: 72.8777
            },
            {
                title: 'Strong Current Warning',
                description: 'Strong underwater currents reported. Exercise extreme caution.',
                severity: 'medium',
                location: 'Chennai Marina',
                lat: 13.0827,
                lng: 80.2707
            }
        ];

        sampleAlerts.forEach(alert => {
            db.run(`INSERT OR IGNORE INTO alerts 
                (title, description, severity, location, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [alert.title, alert.description, alert.severity, alert.location, alert.lat, alert.lng],
                function(err) {
                    if (err) {
                        console.log('Sample alert insertion error:', err.message);
                    }
                }
            );
        });

        console.log('✅ Sample data inserted successfully');
    }, 1000);
}

// API Routes

// Get ocean monitoring data
app.get('/api/ocean-data', (req, res) => {
    db.all('SELECT * FROM ocean_data ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            success: true,
            data: rows,
            message: 'Ocean data retrieved successfully'
        });
    });
});

// Get active alerts
app.get('/api/alerts', (req, res) => {
    db.all('SELECT * FROM alerts WHERE status = "active" ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            success: true,
            data: rows,
            message: 'Alerts retrieved successfully'
        });
    });
});

// Submit hazard report
app.post('/api/report-hazard', (req, res) => {
    const { reporter_name, reporter_email, hazard_type, description, location, latitude, longitude, severity } = req.body;

    if (!reporter_name || !reporter_email || !hazard_type || !description || !location || !severity) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    db.run(`INSERT INTO hazard_reports 
        (reporter_name, reporter_email, hazard_type, description, location, latitude, longitude, severity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [reporter_name, reporter_email, hazard_type, description, location, latitude || null, longitude || null, severity],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
                return;
            }

            // Emit real-time alert to all connected clients
            io.emit('new_hazard_report', {
                id: this.lastID,
                reporter_name,
                hazard_type,
                location,
                severity,
                timestamp: new Date().toISOString()
            });

            res.json({
                success: true,
                message: 'Hazard report submitted successfully',
                report_id: this.lastID
            });
        }
    );
});

// Get dashboard statistics
app.get('/api/dashboard-stats', (req, res) => {
    const stats = {};

    // Get total monitoring locations
    db.get('SELECT COUNT(*) as count FROM ocean_data', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        stats.monitoring_locations = row.count;

        // Get active alerts count
        db.get('SELECT COUNT(*) as count FROM alerts WHERE status = "active"', (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            stats.active_alerts = row.count;

            // Get high risk locations
            db.get('SELECT COUNT(*) as count FROM ocean_data WHERE risk_level = "high"', (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                stats.high_risk_locations = row.count;

                // Get recent reports count
                db.get('SELECT COUNT(*) as count FROM hazard_reports WHERE created_at > datetime("now", "-24 hours")', (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    stats.recent_reports = row.count;

                    res.json({
                        success: true,
                        data: stats,
                        message: 'Dashboard statistics retrieved successfully'
                    });
                });
            });
        });
    });
});

// User registration
app.post('/api/register', async (req, res) => {
    const { username, email, password, role = 'user' } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and password are required'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        res.status(400).json({
                            success: false,
                            message: 'Username or email already exists'
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Error creating user'
                        });
                    }
                    return;
                }

                const token = jwt.sign(
                    { userId: this.lastID, username, role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    success: true,
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, username, email, role }
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// Social login endpoint
app.post('/api/social-login', (req, res) => {
    console.log('🔐 Social login attempt:', req.body);
    
    const { provider, user, role = 'user' } = req.body;
    
    if (!provider || !user || !user.email) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ 
            success: false, 
            message: 'Provider and user information are required' 
        });
    }
    
    const socialEmail = user.email;
    const socialId = user.id;
    const socialUsername = user.name || `${provider}_user`;
    
    console.log(`🔍 Checking for existing user: ${socialEmail}, ${socialId}`);
    
    // Check if user already exists (fallback to email only if social_id column doesn't exist)
    db.get('SELECT * FROM users WHERE email = ?', [socialEmail], (err, existingUser) => {
        if (err) {
            console.log('❌ Database error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (existingUser) {
            console.log('✅ Existing user found:', existingUser.username);
            // User exists, log them in
            res.json({ 
                success: true, 
                message: `Logged in successfully with ${provider}`,
                user: { 
                    id: existingUser.id, 
                    username: existingUser.username, 
                    email: existingUser.email, 
                    role: existingUser.role,
                    provider: provider
                }
            });
        } else {
            console.log('➕ Creating new user:', socialUsername);
            // Create new user - try with social columns first, fallback to basic if needed
            db.run('INSERT INTO users (username, email, password, role, social_id, provider) VALUES (?, ?, ?, ?, ?, ?)', 
                [socialUsername, socialEmail, 'social_login', role, socialId, provider], 
                function(err) {
                    if (err && err.message.includes('no such column')) {
                        console.log('⚠️ Social columns not found, creating basic user');
                        // Fallback to basic user creation
                        db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                            [socialUsername, socialEmail, 'social_login', role], 
                            function(err2) {
                                if (err2) {
                                    console.log('❌ Failed to create basic user:', err2);
                                    return res.status(500).json({ 
                                        success: false, 
                                        message: 'Failed to create user: ' + err2.message
                                    });
                                }
                                
                                console.log('✅ New basic user created with ID:', this.lastID);
                                res.json({ 
                                    success: true, 
                                    message: `Account created and logged in with ${provider}`,
                                    user: { 
                                        id: this.lastID, 
                                        username: socialUsername, 
                                        email: socialEmail, 
                                        role,
                                        provider: provider
                                    }
                                });
                            }
                        );
                    } else if (err) {
                        console.log('❌ Failed to create user:', err);
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Failed to create user: ' + err.message
                        });
                    } else {
                        console.log('✅ New user created with ID:', this.lastID);
                        res.json({ 
                            success: true, 
                            message: `Account created and logged in with ${provider}`,
                            user: { 
                                id: this.lastID, 
                                username: socialUsername, 
                                email: socialEmail, 
                                role,
                                provider: provider
                            }
                        });
                    }
                }
            );
        }
    });
});

// Google OAuth verification endpoint
app.post('/api/auth/google', async (req, res) => {
    console.log('🔐 Google OAuth verification attempt');
    
    const { credential } = req.body;
    
    if (!credential) {
        console.log('❌ Missing Google credential');
        return res.status(400).json({ 
            success: false, 
            message: 'Google credential is required' 
        });
    }
    
    try {
        // Verify the Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const googleUserId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const picture = payload['picture'];
        
        console.log(`🔍 Google user verified: ${name} (${email})`);
        
        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
            if (err) {
                console.log('❌ Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (existingUser) {
                console.log('✅ Existing Google user found:', existingUser.username);
                
                // Generate JWT token
                const token = jwt.sign(
                    { userId: existingUser.id, username: existingUser.username, role: existingUser.role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.json({ 
                    success: true, 
                    message: 'Logged in successfully with Google',
                    token,
                    user: { 
                        id: existingUser.id, 
                        username: existingUser.username, 
                        email: existingUser.email, 
                        role: existingUser.role,
                        provider: 'google',
                        picture: picture
                    }
                });
            } else {
                console.log('➕ Creating new Google user:', name);
                
                // Create new user
                db.run('INSERT INTO users (username, email, password, role, social_id, provider) VALUES (?, ?, ?, ?, ?, ?)', 
                    [name, email, 'google_oauth', 'user', googleUserId, 'google'], 
                    function(err) {
                        if (err) {
                            console.log('❌ Failed to create Google user:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Failed to create user: ' + err.message
                            });
                        }
                        
                        console.log('✅ New Google user created with ID:', this.lastID);
                        
                        // Generate JWT token
                        const token = jwt.sign(
                            { userId: this.lastID, username: name, role: 'user' },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        
                        res.json({ 
                            success: true, 
                            message: 'Account created and logged in with Google',
                            token,
                            user: { 
                                id: this.lastID, 
                                username: name, 
                                email: email, 
                                role: 'user',
                                provider: 'google',
                                picture: picture
                            }
                        });
                    }
                );
            }
        });
        
    } catch (error) {
        console.error('❌ Google token verification failed:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid Google token'
        });
    }
});

// Google OAuth callback endpoint
app.post('/api/auth/google/callback', async (req, res) => {
    console.log('🔐 Google OAuth callback received');
    
    const { code } = req.body;
    
    if (!code) {
        console.log('❌ Missing authorization code');
        return res.status(400).json({ 
            success: false, 
            message: 'Authorization code is required' 
        });
    }
    
    try {
        // Exchange authorization code for tokens
        const { tokens } = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);
        
        // Get user info from Google
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const googleUserId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const picture = payload['picture'];
        
        console.log(`🔍 Google user verified: ${name} (${email})`);
        
        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
            if (err) {
                console.log('❌ Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (existingUser) {
                console.log('✅ Existing Google user found:', existingUser.username);
                
                // Generate JWT token
                const token = jwt.sign(
                    { userId: existingUser.id, username: existingUser.username, role: existingUser.role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.json({ 
                    success: true, 
                    message: 'Logged in successfully with Google',
                    token,
                    user: { 
                        id: existingUser.id, 
                        username: existingUser.username, 
                        email: existingUser.email, 
                        role: existingUser.role,
                        provider: 'google',
                        picture: picture
                    }
                });
            } else {
                console.log('➕ Creating new Google user:', name);
                
                // Create new user
                db.run('INSERT INTO users (username, email, password, role, social_id, provider) VALUES (?, ?, ?, ?, ?, ?)', 
                    [name, email, 'google_oauth', 'user', googleUserId, 'google'], 
                    function(err) {
                        if (err) {
                            console.log('❌ Failed to create Google user:', err);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Failed to create user: ' + err.message
                            });
                        }
                        
                        console.log('✅ New Google user created with ID:', this.lastID);
                        
                        // Generate JWT token
                        const token = jwt.sign(
                            { userId: this.lastID, username: name, role: 'user' },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        
                        res.json({ 
                            success: true, 
                            message: 'Account created and logged in with Google',
                            token,
                            user: { 
                                id: this.lastID, 
                                username: name, 
                                email: email, 
                                role: 'user',
                                provider: 'google',
                                picture: picture
                            }
                        });
                    }
                );
            }
        });
        
    } catch (error) {
        console.error('❌ Google OAuth callback error:', error);
        res.status(401).json({
            success: false,
            message: 'Google OAuth verification failed: ' + error.message
        });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
            return;
        }

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        try {
            if (user.password === 'social_login') {
                // Social login user trying regular login
                res.status(400).json({
                    success: false,
                    message: 'Please use social login for this account'
                });
                return;
            }

            // Verify password for regular users
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email, 
                    role: user.role 
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    });
});

// WebSocket connections for real-time updates
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Send initial data
    socket.emit('connection_established', {
        message: 'Connected to AquaSutra Ocean Safety Platform',
        timestamp: new Date().toISOString()
    });

    // Handle client requests for live data
    socket.on('request_ocean_data', () => {
        db.all('SELECT * FROM ocean_data ORDER BY timestamp DESC LIMIT 10', (err, rows) => {
            if (!err) {
                socket.emit('ocean_data_update', rows);
            }
        });
    });

    socket.on('request_alerts', () => {
        db.all('SELECT * FROM alerts WHERE status = "active" ORDER BY created_at DESC', (err, rows) => {
            if (!err) {
                socket.emit('alerts_update', rows);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Simulate real-time ocean data updates
cron.schedule('*/30 * * * * *', () => {
    // Update ocean data every 30 seconds
    const locations = ['Mumbai Coast', 'Chennai Marina', 'Goa Beaches', 'Kerala Backwaters', 'Andaman Islands'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    const waveHeight = (Math.random() * 3 + 0.5).toFixed(1);
    const waterTemp = (Math.random() * 10 + 20).toFixed(1);
    const windSpeed = (Math.random() * 20 + 5).toFixed(1);
    const visibility = (Math.random() * 10 + 5).toFixed(1);
    const riskLevel = waveHeight > 2.5 ? 'high' : waveHeight > 1.5 ? 'medium' : 'low';

    // Emit real-time update
    io.emit('ocean_data_realtime', {
        location: randomLocation,
        wave_height: waveHeight,
        water_temperature: waterTemp,
        wind_speed: windSpeed,
        visibility: visibility,
        risk_level: riskLevel,
        timestamp: new Date().toISOString()
    });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'premium-website', 'index.html'));
});

// Serve Google OAuth callback page
app.get('/auth/google/callback', (req, res) => {
    res.sendFile(path.join(__dirname, 'premium-website', 'auth', 'google', 'callback.html'));
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'AquaSutra Ocean Safety API',
        version: '1.0.0',
        endpoints: {
            'GET /api/ocean-data': 'Get ocean monitoring data',
            'GET /api/alerts': 'Get active alerts',
            'POST /api/report-hazard': 'Submit hazard report',
            'GET /api/dashboard-stats': 'Get dashboard statistics',
            'POST /api/register': 'Register new user',
            'POST /api/login': 'User login'
        },
        websocket: {
            events: {
                'ocean_data_realtime': 'Real-time ocean data updates',
                'new_hazard_report': 'New hazard report notifications',
                'alerts_update': 'Alert updates'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`
🌊 AquaSutra Ocean Safety Platform
🚀 Server running on http://localhost:${PORT}
📡 WebSocket server active
💾 Database: SQLite (aquasutra.db)
🔧 Environment: ${process.env.NODE_ENV || 'development'}
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = app;
