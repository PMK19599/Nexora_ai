import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/careerService';
import { CareerPath, Roadmap, Resume, User } from '../models';

export const uploadSyllabus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) { res.status(400).json({ success: false, message: 'Upload a PDF' }); return; }
    res.status(201).json({ success: true, data: await svc.uploadAndAnalyzeSyllabus(req.user!._id.toString(), req.file.path, req.body.dreamJob, req.body.company) });
  } catch (e) { next(e); }
};
export const analyze = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dreamJob, company, skills } = req.body;
    if (skills?.length) await User.findByIdAndUpdate(req.user!._id, { skills });
    res.status(201).json({ success: true, data: await svc.analyzeCareer(req.user!._id.toString(), dreamJob, company, skills || req.user!.skills || []) });
  } catch (e) { next(e); }
};
export const generateRoadmap = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await svc.getGapAnalysis(req.user!._id.toString(), req.body.careerPathId);
    res.status(201).json({ success: true, data: await svc.generateRoadmap(req.user!._id.toString(), req.body.careerPathId, req.body.duration || 6) });
  } catch (e) { next(e); }
};
export const getGapAnalysis = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.query.careerPathId) { res.status(400).json({ success: false, message: 'careerPathId required' }); return; }
    res.json({ success: true, data: await svc.getGapAnalysis(req.user!._id.toString(), req.query.careerPathId as string) });
  } catch (e) { next(e); }
};
export const getIndustryInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await svc.getIndustryInsights(req.query.dreamJob as string, req.query.company as string) }); } catch (e) { next(e); }
};
export const generateResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const r = req.body.content ? await Resume.findOneAndUpdate({ userId: req.user!._id }, { content: req.body.content, careerPathId: req.body.careerPathId }, { upsert: true, new: true }) : await svc.generateResume(req.user!._id.toString(), req.body.careerPathId);
    res.status(201).json({ success: true, data: r });
  } catch (e) { next(e); }
};
export const getCareerPaths = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await CareerPath.find({ userId: req.user!._id }).sort({ createdAt: -1 }) }); } catch (e) { next(e); }
};
export const getRoadmaps = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await Roadmap.find({ userId: req.user!._id }).sort({ createdAt: -1 }) }); } catch (e) { next(e); }
};
export const getResumes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.json({ success: true, data: await Resume.find({ userId: req.user!._id }).sort({ createdAt: -1 }) }); } catch (e) { next(e); }
};
