import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { AuthRequest } from '../types';
import { GameSession } from '../models/Game';
import { User, Notification } from '../models';

type AsyncHandler = (req: any, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler): AsyncHandler =>
  (req, res, next) => fn(req, res, next).catch(next);

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationParams;
}

export async function paginateQuery<T extends Document>(
  model: Model<T>,
  filter: Record<string, any>,
  req: Request,
  options: { sort?: Record<string, any>; select?: string; populate?: any } = {}
): Promise<PaginatedResult<T>> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(options.sort || { createdAt: -1 })
      .select(options.select || '')
      .populate(options.populate || ''),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getRecentAccuracy(userId: string, sessionLimit = 3, defaultAccuracy = 70): Promise<number> {
  const recentSessions = await GameSession.find({ userId }).sort({ createdAt: -1 }).limit(sessionLimit);
  if (recentSessions.length === 0) return defaultAccuracy;
  return recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
}

export async function findSimilarUsers(
  currentUserId: string,
  extraFilter: Record<string, any> = {},
  limit = 20
) {
  const me = await User.findById(currentUserId);
  if (!me) return { me: null, similarUsers: [], userIds: [] };

  const similarUsers = await User.find({
    _id: { $ne: me._id },
    neurodivergentType: me.neurodivergentType,
    ...extraFilter,
  }).limit(limit);

  return {
    me,
    similarUsers,
    userIds: similarUsers.map(u => u._id),
  };
}

export async function createNotification(
  userId: any,
  type: string,
  title: string,
  message: string,
  data?: Record<string, any>
) {
  return Notification.create({ userId, type, title, message, ...(data && { data }) });
}
