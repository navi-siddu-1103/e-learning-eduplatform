import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
    // Augmenting the NodeJS global type
    var mongoose: GlobalMongoose | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-learning-platform';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize global mongoose with proper types
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    try {
      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          cached.promise = null;
          throw error;
        });
    } catch (error) {
      console.error('Failed to create MongoDB connection:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    
    // Add connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    return cached.conn;
  } catch (error) {
    console.error('Failed to establish MongoDB connection:', error);
    cached.promise = null;
    throw error;
  }
}

export async function disconnectDB() {
  if (cached.conn) {
    try {
      await mongoose.connection.close();
      cached.conn = null;
      cached.promise = null;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

export function getConnectionStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  };
}

export async function clearDatabase() {
  if (process.env.NODE_ENV === 'test') {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      
      const collections = await db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  } else {
    console.warn('Attempted to clear database outside of test environment');
  }
}
