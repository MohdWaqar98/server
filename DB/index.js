import mongoose from "mongoose";
import { DB_NAME, MONGODB_URL,PORT } from "../constants.js";

const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(MONGODB_URL);
        console.log(`Connected to the database: ${connectionInstance.connection.name}`);
        console.log(`Database URL: ${MONGODB_URL}`);
        console.log(`Database Host: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
        process.exit(1);
    }
}

export default dbConnect;