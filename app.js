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
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Define the routes
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/contact',msgRouter);

app.get('/',(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Welcome to Humotion API"
    })
})

dbConnect().then(()=>{
    app.on("Error", (err) => {
        console.error("Error in database connection:", err);
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});