import mongoose from "mongoose";
import { log } from "node:console";

type ConnectionOnject = {
    isConnected?: number
}

const connection: ConnectionOnject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to Database");
        return;
    }
    try {
        const db= await mongoose.connect(process.env.MONGO_URI || '', {})
        connection.isConnected= db.connections[0].readyState

        console.log("DB connected successfully")
    } catch (error) {
        console.log("DB connection failed", error);

        process.exit(1)
    }
}

export default dbConnect 