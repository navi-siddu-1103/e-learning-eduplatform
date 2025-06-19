import type { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!apiKey) {
    res.status(401).json({
      message: 'API key is missing'
    });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(403).json({
      message: 'Invalid API key'
    });
    return;
  }

  next();
};
