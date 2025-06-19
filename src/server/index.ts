import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB, getConnectionStatus } from '../lib/db';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database connection
async function initializeDatabase() {
  try {
    await connectDB();
    console.log('Database connected:', getConnectionStatus());
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await disconnectDB();
    console.log('Server is shutting down');
    process.exit(0);
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

export default app;
