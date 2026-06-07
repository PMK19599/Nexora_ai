import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/reviewService';

export const logAttempt = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topicId, quality, responseTime, correct } = req.body;
    const p = await svc.logReviewAttempt(req.user!._id.toString(), topicId, quality, responseTime, correct);
    res.json({ success: true, data: p, message: p.mastery >= 80 ? '🎉 Excellent mastery!' : p.mastery >= 50 ? '📈 Good progress!' : '💪 Keep practicing!' });
  } catch (e) { next(e); }
};
export const getQueue = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.getReviewQueue(req.user!._id.toString()) }); } catch (e) { next(e); }
};
export const getPrediction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.query.topicId) { res.status(400).json({ success: false, message: 'topicId required' }); return; }
    res.json({ success: true, data: await svc.getReviewPrediction(req.user!._id.toString(), req.query.topicId as string) });
  } catch (e) { next(e); }
};
export const getStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.getReviewStats(req.user!._id.toString()) }); } catch (e) { next(e); }
};
