require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketManager = require('./services/socketManager');
const threatRoutes = require('./routes/threats');
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const aiRoutes = require('./routes/ai');
const { startKeepAlive } = require('./services/keepAliveService');
const { protect, requireRole } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', protect, requireRole('user'), analyticsRoutes);

// Core Routes
app.use('/api/auth', authRoutes);
app.use('/api/threats', protect, requireRole('user'), threatRoutes);
app.use('/api/incidents', protect, requireRole('user'), incidentRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: dbStatus,
        timestamp: new Date()
    });
});

app.get('/', (req, res) => {
    res.send('CyberShield SOC API is running...');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start Server Wrapper
const startServer = async () => {
    try {
        // Database Connection
        await connectDB();

        // Initialize Socket Manager (Real-time Engine)
        socketManager(io);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            startKeepAlive();
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
