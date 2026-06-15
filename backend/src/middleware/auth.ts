import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models';
import { AuthRequest } from '../types';

/**
 * Resolve the JWT secret, refusing to start with a hardcoded fallback in production.
 * In non-production environments a random per-process secret is generated so the
 * app can still boot for development without an explicit JWT_SECRET.
 */
let _devFallbackSecret: string | null = null;
export const getJwtSecret = (): string => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  if (!_devFallbackSecret) _devFallbackSecret = crypto.randomBytes(32).toString('hex');
  return _devFallbackSecret;
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    else if (req.cookies?.token) token = req.cookies.token;
    if (!token) { res.status(401).json({ success: false, message: 'Not authorized' }); return; }
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) { res.status(401).json({ success: false, message: 'User not found' }); return; }
    req.user = user;
    next();
  } catch { res.status(401).json({ success: false, message: 'Not authorized' }); }
};

export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) { res.status(403).json({ success: false, message: 'Forbidden' }); return; }
  next();
};
