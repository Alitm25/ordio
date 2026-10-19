import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env file");
}

// One shared connection for every request (kept on globalThis so dev hot-reloads don't open new ones)
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: MongooseCache };
const cached: MongooseCache = (globalWithMongoose.mongoose ??= { conn: null, promise: null });

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            // Give up after 10s instead of the default 30s, so users see an error quickly when the DB is down
            serverSelectionTimeoutMS: 10_000,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Forget the failed attempt. Otherwise every later request would re-use this rejected
        // promise and fail forever, even after the database is back (until the server restarts).
        cached.promise = null;
        throw error;
    }

    // make sure that all models are registered
    await import("@/models/User");
    await import("@/models/Order");
    await import("@/models/Customer");
    await import("@/models/Product");

    return cached.conn;
}
