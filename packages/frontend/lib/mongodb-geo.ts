import mongoose from "mongoose";

const GEO_MONGO_URI = process.env.MONGO_GEO_URI as string;

if (!GEO_MONGO_URI) {
    throw new Error("GEO_MONGO_URI secret not available");
}

let cached = (global as any).mongooseGeo;

if (!cached) {
  cached = (global as any).mongooseGeo = { conn: null, promise: null };
}

export async function connectGeoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .createConnection(GEO_MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .asPromise();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
