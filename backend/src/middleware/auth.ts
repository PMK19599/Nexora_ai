import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AuthRequest } from '../types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    else if (req.cookies?.token) token = req.cookies.token;
    if (!token) { res.status(401).json({ success: false, message: 'Not authorized' }); return; }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'neurolearn-jwt-secret-dev-2026') as { id: string };
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
