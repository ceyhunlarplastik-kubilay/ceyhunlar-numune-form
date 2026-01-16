import mongoose from "mongoose";
// import { Resource } from "sst";

// const MONGO_URI = Resource.MongoUri.value;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    throw new Error("MongoUri secret not available");
}

let cached = (global as any).mongoose;
if (!cached) {
    cached = (global as any).mongoose = { promise: null, conn: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
