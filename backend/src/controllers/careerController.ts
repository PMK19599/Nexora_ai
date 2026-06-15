import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as svc from '../services/careerService';
import { CareerPath, Roadmap, User } from '../models';
import { asyncHandler, findSimilarUsers } from '../utils/controllerUtils';

export const uploadSyllabus = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ success: false, message: 'Upload a PDF' }); return; }
  res.status(201).json({ success: true, data: await svc.uploadAndAnalyzeSyllabus(req.user!._id.toString(), req.file.path, req.body.dreamJob, req.body.company) });
});

export const analyze = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { dreamJob, company, skills } = req.body;
  if (skills?.length) await User.findByIdAndUpdate(req.user!._id, { skills });
  res.status(201).json({ success: true, data: await svc.analyzeCareer(req.user!._id.toString(), dreamJob, company, skills || req.user!.skills || []) });
});

export const generateRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  await svc.getGapAnalysis(req.user!._id.toString(), req.body.careerPathId);
  res.status(201).json({ success: true, data: await svc.generateRoadmap(req.user!._id.toString(), req.body.careerPathId, req.body.duration || 6) });
});

export const getGapAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.query.careerPathId) { res.status(400).json({ success: false, message: 'careerPathId required' }); return; }
  res.json({ success: true, data: await svc.getGapAnalysis(req.user!._id.toString(), req.query.careerPathId as string) });
});

export const getIndustryInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: await svc.getIndustryInsights(req.query.dreamJob as string, req.query.company as string) });
});

export const getCareerPaths = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: await CareerPath.find({ userId: req.user!._id }).sort({ createdAt: -1 }) });
});

export const getRoadmaps = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: await Roadmap.find({ userId: req.user!._id }).sort({ createdAt: -1 }) });
});

export const importRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { roadmapId } = req.body;
  const originalRoadmap = await Roadmap.findById(roadmapId);
  if (!originalRoadmap) { res.status(404).json({ success: false, message: 'Original roadmap not found' }); return; }

  const newRoadmap = await Roadmap.create({
    userId: req.user!._id,
    careerPathId: originalRoadmap.careerPathId,
    duration: originalRoadmap.duration,
    months: originalRoadmap.months,
    interviewQuestions: originalRoadmap.interviewQuestions,
    status: 'active',
    progress: 0
  });

  res.status(201).json({ success: true, data: newRoadmap, message: 'Roadmap imported successfully!' });
});

export const shareRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { roadmapId } = req.body;
  const roadmap = await Roadmap.findOneAndUpdate(
    { _id: roadmapId, userId: req.user!._id },
    { isPublic: true },
    { new: true }
  );
  if (!roadmap) { res.status(404).json({ success: false, message: 'Roadmap not found' }); return; }
  res.json({ success: true, message: 'Roadmap shared with peers successfully!', data: roadmap });
});

export const getSharedRoadmaps = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { me, userIds } = await findSimilarUsers(req.user!._id.toString(), { role: 'student' }, 10);
  if (!me) { res.status(404).json({ success: false, message: 'User not found' }); return; }

  const roadmaps = await Roadmap.find({
    userId: { $in: userIds },
    isPublic: true
  })
  .populate('userId', 'name neurodivergentType')
  .sort({ createdAt: -1 })
  .limit(10);

  res.json({ success: true, data: roadmaps });
});
