import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './constants.js';
import dbConnect from './DB/index.js';
import userRouter from './Routes/auth.js';
import msgRouter from './Routes/contact.js';
dotenv.config({ path: './.env' });

const app = express();

// CORS configuration for both development and production
const allowedOrigins = [
    'http://localhost:8080', 
    'http://localhost:3000',
    'https://server-six-omega-20.vercel.app',
    'https://www.humotionai.com', // Add your frontend domain
    'https://humotion-frontend.vercel.app'  // Add your frontend domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(cookieParser());

// Define the routes
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/contact',msgRouter);
app.get('/api/v1/deployment-status', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Deployment successful"
    });
});

app.get('/test', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is working!",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

app.get('/',(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Welcome to Humotion API"
    })
})

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
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

dbConnect().then(()=>{
    const server = app.listen(PORT || 3000, () => {
        console.log(`Server is running on port ${PORT || 3000}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
            console.log('Process terminated');
        });
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    // Don't exit in production, let the server run without DB
    if (process.env.NODE_ENV === 'production') {
        console.log('Running without database connection in production');
        const server = app.listen(PORT || 3000, () => {
            console.log(`Server is running on port ${PORT || 3000} (without DB)`);
        });
    } else {
        process.exit(1);
    }
});