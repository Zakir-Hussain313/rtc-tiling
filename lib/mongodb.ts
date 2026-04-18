import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
}

/**
 * In development, Next.js hot-reloads modules constantly.
 * Without this singleton pattern, every reload creates a new
 * connection and you'll exhaust your MongoDB connection pool fast.
 * We store the connection promise on the global object so it
 * persists across hot reloads in dev, but is created fresh in prod.
 */

declare global {
    // eslint-disable-next-line no-var
    var _mongooseConn: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = global._mongooseConn;

if (!cached) {
    cached = global._mongooseConn = {
        conn: null,
        promise: null,
    };
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}