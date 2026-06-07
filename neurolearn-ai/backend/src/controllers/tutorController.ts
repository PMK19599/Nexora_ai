import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/tutorService';
import { PeerTutor, PeerSession } from '../models';

export const getTutors = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.query.subject) res.json({ success: true, data: await svc.findMatchingTutors(req.user!._id.toString(), req.query.subject as string) });
    else res.json({ success: true, data: await PeerTutor.find({ isActive: true }).populate('userId', 'name email avatar learningTrack neurodivergentType timezone').sort({ rating: -1 }) });
  } catch (e) { next(e); }
};
export const registerAsTutor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existing = await PeerTutor.findOne({ userId: req.user!._id });
    if (existing) { const u = await PeerTutor.findOneAndUpdate({ userId: req.user!._id }, { ...req.body, isActive: true }, { new: true }); res.json({ success: true, data: u }); return; }
    res.status(201).json({ success: true, data: await PeerTutor.create({ userId: req.user!._id, ...req.body }) });
  } catch (e) { next(e); }
};
export const requestSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(201).json({ success: true, data: await svc.requestSession(req.user!._id.toString(), req.body.tutorId, req.body.subject, req.body.scheduledAt, req.body.duration) }); } catch (e) { next(e); }
};
export const acceptSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.acceptSession(req.body.sessionId, req.user!._id.toString()) }); } catch (e) { next(e); }
};
export const rateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.rateSession(req.body.sessionId, req.user!._id.toString(), req.body.rating, req.body.feedback) }); } catch (e) { next(e); }
};
export const getSchedule = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.getTutorSchedule(req.user!._id.toString()) }); } catch (e) { next(e); }
};
export const getMySessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await PeerSession.find({ $or: [{ tutorId: req.user!._id }, { studentId: req.user!._id }] }).populate('tutorId', 'name email avatar').populate('studentId', 'name email avatar').sort({ scheduledAt: -1 }) }); } catch (e) { next(e); }
};
