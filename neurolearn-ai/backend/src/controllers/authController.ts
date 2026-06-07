import { Request, Response, NextFunction } from 'express';
import { User, Notification } from '../models';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

const sendToken = (user: any, code: number, res: Response) => {
  const token = user.getSignedJwtToken();
  const opts = { expires: new Date(Date.now() + 7 * 864e5), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const };
  const u = user.toObject(); delete u.password;
  res.status(code).cookie('token', token, opts).json({ success: true, token, user: u });
};

const getDefaults = (type: string) => {
  const base = { fontSize: 'medium' as const, colorContrast: 'normal' as const, animations: true, readingMode: false, audioMode: false, focusMode: false, fontFamily: 'default' as const, lineSpacing: 'normal' as const, pomodoroEnabled: false, pomodoroWork: 25, pomodoroBreak: 5, reducedDistractions: false, predictableNavigation: false, ttsEnabled: false, ttsSpeed: 1 };
  if (type === 'adhd') return { ...base, focusMode: true, pomodoroEnabled: true, pomodoroWork: 15, reducedDistractions: true };
  if (type === 'autism') return { ...base, predictableNavigation: true, animations: false, colorContrast: 'high' as const };
  if (type === 'dyslexia') return { ...base, fontFamily: 'opendyslexic' as const, lineSpacing: 'wide' as const, ttsEnabled: true, fontSize: 'large' as const };
  return base;
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, learningTrack, neurodivergentType, timezone, communicationStyle } = req.body;
    if (await User.findOne({ email })) throw new AppError('Email already registered', 400);
    const user = await User.create({ name, email, password, learningTrack: learningTrack || 'normal', neurodivergentType: neurodivergentType || 'none', accessibility: getDefaults(neurodivergentType || 'none'), timezone: timezone || 'UTC', communicationStyle: communicationStyle || 'text' });
    await Notification.create({ userId: user._id, type: 'system', title: 'Welcome to NeuroLearn AI!', message: 'Your personalized learning journey begins now.' });
    sendToken(user, 201, res);
  } catch (e) { next(e); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid credentials', 401);
    user.lastActive = new Date(); user.isOnline = true; await user.save();
    sendToken(user, 200, res);
  } catch (e) { next(e); }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) await User.findByIdAndUpdate(req.user._id, { isOnline: false, socketId: undefined });
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10000), httpOnly: true }).status(200).json({ success: true, message: 'Logged out' });
  } catch (e) { next(e); }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, user: await User.findById(req.user?._id) }); } catch (e) { next(e); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fields = ['name','avatar','learningTrack','neurodivergentType','skills','interests','timezone','communicationStyle','accessibility'];
    const updates: any = {};
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
    if (updates.neurodivergentType && updates.neurodivergentType !== req.user?.neurodivergentType) updates.accessibility = { ...(req.user?.accessibility || {}), ...getDefaults(updates.neurodivergentType), ...(updates.accessibility || {}) };
    const user = await User.findByIdAndUpdate(req.user?._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, notifications: await Notification.find({ userId: req.user?._id }).sort({ createdAt: -1 }).limit(50) }); } catch (e) { next(e); }
};

export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.params.id === 'all') await Notification.updateMany({ userId: req.user?._id, read: false }, { read: true });
    else await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (e) { next(e); }
};
