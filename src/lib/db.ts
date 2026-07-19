import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env file");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;

    // اطمینان از register شدن همه‌ی مدل‌ها
    await import("@/models/User");
    await import("@/models/Order");
    await import("@/models/Customer");
    await import("@/models/Product");

    return cached.conn;
}