import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/reviewService';
import { asyncHandler } from '../utils/controllerUtils';

export const logAttempt = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { topicId, quality, responseTime, correct } = req.body;
  const p = await svc.logReviewAttempt(req.user!._id.toString(), topicId, quality, responseTime, correct);
  res.json({ success: true, data: p, message: p.mastery >= 80 ? '🎉 Excellent mastery!' : p.mastery >= 50 ? '📈 Good progress!' : '💪 Keep practicing!' });
});

export const getQueue = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: await svc.getReviewQueue(req.user!._id.toString()) });
});

export const getPrediction = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.query.topicId) { res.status(400).json({ success: false, message: 'topicId required' }); return; }
  res.json({ success: true, data: await svc.getReviewPrediction(req.user!._id.toString(), req.query.topicId as string) });
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: await svc.getReviewStats(req.user!._id.toString()) });
});
