import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/groupService';
import { GroupMeeting } from '../models';

export const matchGroups = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.json({ success: true, data: await svc.matchStudyGroups(req.user!._id.toString()) }); } catch (e) { next(e); } };
export const createGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.status(201).json({ success: true, data: await svc.createGroup(req.user!._id.toString(), req.body) }); } catch (e) { next(e); } };
export const getGroups = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.json({ success: true, data: await svc.getUserGroups(req.user!._id.toString()) }); } catch (e) { next(e); } };
export const joinGroup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.json({ success: true, data: await svc.joinGroup(req.user!._id.toString(), req.body.groupId) }); } catch (e) { next(e); } };
export const scheduleMeeting = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.status(201).json({ success: true, data: await svc.scheduleMeeting(req.params.groupId as string, req.user!._id.toString(), req.body) }); } catch (e) { next(e); } };
export const getGroupMeetings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.json({ success: true, data: await GroupMeeting.find({ groupId: req.params.groupId }).populate('attendees', 'name email avatar').sort({ scheduledAt: 1 }) }); } catch (e) { next(e); } };
