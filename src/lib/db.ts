import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose;
}

// Initialize the global mongoose object with proper types
global.mongoose = global.mongoose || {
  conn: null,
  promise: null,
  isConnecting: false
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-learning-platform';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const cached = global.mongoose;

export async function connectDB() {
  // If we have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we're already connecting, wait for the existing promise
  if (cached.isConnecting) {
    if (cached.promise) {
      return await cached.promise;
    }
    throw new Error('Connection in progress but no promise available');
  }

  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  };  try {
    cached.isConnecting = true;
    cached.promise = mongoose.connect(MONGODB_URI, opts);
    cached.conn = await cached.promise;

    // Add connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cached.isConnecting = false;
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
      cached.isConnecting = false;
      cached.conn = null;
      cached.promise = null;
    });    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await disconnectDB();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish MongoDB connection:', error);
    cached.isConnecting = false;
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
      cached.conn = null;
      cached.promise = null;
      cached.isConnecting = false;
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
    isConnecting: cached.isConnecting,
    readyState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  };
}

export function getDatabaseStats() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  
  return {
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    collections: mongoose.connection.collections,
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
