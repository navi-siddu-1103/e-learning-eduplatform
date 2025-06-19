import { Router } from 'express';
import type { Request, Response, RequestHandler } from 'express';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { RegisterRequest, LoginRequest } from '../../types/express';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

const asyncHandler = (handler: AsyncHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

const registerHandler = asyncHandler(async (req: RegisterRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save middleware
    role
  });

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Register route
router.post('/register', registerHandler);

const loginHandler = asyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Login route
router.post('/login', loginHandler);

// Get current user route
const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const user = await User.findById(decoded.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

router.get('/me', getCurrentUser);

export default router;
