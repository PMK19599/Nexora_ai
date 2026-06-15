import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User, Topic, CareerPath, PeerTutor, StudyGroup, PeerSession } from '../models';
import { asyncHandler, paginateQuery } from '../utils/controllerUtils';

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [totalUsers, totalTopics, totalCareerPaths, totalTutors, totalGroups, totalSessions, activeUsers, neurodivergentUsers] = await Promise.all([User.countDocuments(), Topic.countDocuments(), CareerPath.countDocuments(), PeerTutor.countDocuments({ isActive: true }), StudyGroup.countDocuments({ isActive: true }), PeerSession.countDocuments(), User.countDocuments({ isOnline: true }), User.countDocuments({ learningTrack: 'neurodivergent' })]);
  const userGrowth = await User.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 30 }]);
  const trackDistribution = await User.aggregate([{ $group: { _id: '$learningTrack', count: { $sum: 1 } } }]);
  const neurodivergentDistribution = await User.aggregate([{ $match: { learningTrack: 'neurodivergent' } }, { $group: { _id: '$neurodivergentType', count: { $sum: 1 } } }]);
  res.json({ success: true, data: { totalUsers, totalTopics, totalCareerPaths, totalTutors, totalGroups, totalSessions, activeUsers, neurodivergentUsers, userGrowth, trackDistribution, neurodivergentDistribution } });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, track, role } = req.query;
  const q: any = {};
  if (search) q.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  if (track) q.learningTrack = track; if (role) q.role = role;
  const result = await paginateQuery(User, q, req, { select: '-password' });
  res.json({ success: true, data: result.data, pagination: result.pagination });
});
