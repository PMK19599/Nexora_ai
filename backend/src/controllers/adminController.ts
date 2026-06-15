import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User, Topic, CareerPath, PeerTutor, StudyGroup, PeerSession } from '../models';

const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalTopics, totalCareerPaths, totalTutors, totalGroups, totalSessions, activeUsers, neurodivergentUsers] = await Promise.all([User.countDocuments(), Topic.countDocuments(), CareerPath.countDocuments(), PeerTutor.countDocuments({ isActive: true }), StudyGroup.countDocuments({ isActive: true }), PeerSession.countDocuments(), User.countDocuments({ isOnline: true }), User.countDocuments({ learningTrack: 'neurodivergent' })]);
    const userGrowth = await User.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 30 }]);
    const trackDistribution = await User.aggregate([{ $group: { _id: '$learningTrack', count: { $sum: 1 } } }]);
    const neurodivergentDistribution = await User.aggregate([{ $match: { learningTrack: 'neurodivergent' } }, { $group: { _id: '$neurodivergentType', count: { $sum: 1 } } }]);
    res.json({ success: true, data: { totalUsers, totalTopics, totalCareerPaths, totalTutors, totalGroups, totalSessions, activeUsers, neurodivergentUsers, userGrowth, trackDistribution, neurodivergentDistribution } });
  } catch (e) { next(e); }
};
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20, search, track, role } = req.query;
    const q: any = {};
    if (search) { const s = escapeRegex(String(search)); q.$or = [{ name: { $regex: s, $options: 'i' } }, { email: { $regex: s, $options: 'i' } }]; }
    if (track) q.learningTrack = track; if (role) q.role = role;
    const [users, total] = await Promise.all([User.find(q).select('-password').skip((Number(page)-1)*Number(limit)).limit(Number(limit)).sort({ createdAt: -1 }), User.countDocuments(q)]);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (e) { next(e); }
};
