import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/groupService';
import { GroupMeeting } from '../models';
import { asyncHandler } from '../utils/controllerUtils';

export const matchGroups = asyncHandler(async (req: AuthRequest, res: Response) => { res.json({ success: true, data: await svc.matchStudyGroups(req.user!._id.toString()) }); });
export const createGroup = asyncHandler(async (req: AuthRequest, res: Response) => { res.status(201).json({ success: true, data: await svc.createGroup(req.user!._id.toString(), req.body) }); });
export const getGroups = asyncHandler(async (req: AuthRequest, res: Response) => { res.json({ success: true, data: await svc.getUserGroups(req.user!._id.toString()) }); });
export const joinGroup = asyncHandler(async (req: AuthRequest, res: Response) => { res.json({ success: true, data: await svc.joinGroup(req.user!._id.toString(), req.body.groupId) }); });
export const scheduleMeeting = asyncHandler(async (req: AuthRequest, res: Response) => { res.status(201).json({ success: true, data: await svc.scheduleMeeting(req.params.groupId as string, req.user!._id.toString(), req.body) }); });
export const getGroupMeetings = asyncHandler(async (req: AuthRequest, res: Response) => { res.json({ success: true, data: await GroupMeeting.find({ groupId: req.params.groupId }).populate('attendees', 'name email avatar').sort({ scheduledAt: 1 }) }); });
