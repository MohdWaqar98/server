import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
export const DB_NAME = "humotion";
export const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://dyashraj1805:Rajyash2005@cluster0.fhh2wct.mongodb.net/humotion?retryWrites=true&w=majority";
export const PORT = process.env.PORT || 3000;