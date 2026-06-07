import { StudentProgress, ReviewHistory } from '../models';
import { Types } from 'mongoose';

export const calculateSM2 = (quality: number, repetitions: number, easinessFactor: number, interval: number) => {
  let newRep = repetitions, newEF = easinessFactor, newInt = interval;
  if (quality >= 3) {
    newInt = newRep === 0 ? 1 : newRep === 1 ? 6 : Math.round(interval * easinessFactor);
    newRep += 1;
  } else { newRep = 0; newInt = 1; }
  newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;
  return { repetitions: newRep, easinessFactor: newEF, interval: newInt };
};

export const calculateRetention = (daysSince: number, strength: number): number =>
  Math.max(0, Math.min(100, Math.exp(-daysSince / Math.max(strength, 0.1)) * 100));

export const predictForgetDate = (strength: number, threshold = 50): Date => {
  const days = -strength * Math.log(threshold / 100);
  const d = new Date(); d.setDate(d.getDate() + Math.round(days)); return d;
};

export const logReviewAttempt = async (userId: string, topicId: string, quality: number, responseTime: number, correct: boolean) => {
  let p = await StudentProgress.findOne({ userId: new Types.ObjectId(userId), topicId: new Types.ObjectId(topicId) });
  if (!p) p = new StudentProgress({ userId: new Types.ObjectId(userId), topicId: new Types.ObjectId(topicId) });
  const prevInt = p.interval, prevEF = p.easinessFactor;
  const sm2 = calculateSM2(quality, p.repetitions, p.easinessFactor, p.interval);
  Object.assign(p, { repetitions: sm2.repetitions, easinessFactor: sm2.easinessFactor, interval: sm2.interval });
  p.totalAttempts += 1;
  if (correct) p.correctAttempts += 1;
  p.retentionRate = (p.correctAttempts / p.totalAttempts) * 100;
  p.memoryStrength = p.easinessFactor * Math.log(p.repetitions + 1) + 1;
  p.confidence = Math.min(100, quality * 20);
  p.mastery = Math.min(100, (p.correctAttempts / Math.max(p.totalAttempts, 1)) * 100 * (p.repetitions / (p.repetitions + 3)));
  const recent = p.reviewHistory.slice(-5);
  if (recent.length > 1) p.learningVelocity = recent.reduce((s, h) => s + h.quality, 0) / recent.length / 5;
  p.lastReviewDate = new Date();
  const next = new Date(); next.setDate(next.getDate() + sm2.interval); p.nextReviewDate = next;
  p.predictedForgetDate = predictForgetDate(p.memoryStrength);
  p.reviewHistory.push({ date: new Date(), quality, responseTime, correct });
  await p.save();
  await ReviewHistory.create({ userId: new Types.ObjectId(userId), topicId: new Types.ObjectId(topicId), quality, responseTime, correct, previousInterval: prevInt, newInterval: sm2.interval, previousEasiness: prevEF, newEasiness: sm2.easinessFactor });
  return p;
};

export const getReviewQueue = async (userId: string) => {
  const now = new Date();
  const due = await StudentProgress.find({ userId: new Types.ObjectId(userId), nextReviewDate: { $lte: now } }).populate('topicId').sort({ nextReviewDate: 1 }).limit(20);
  const upcoming = await StudentProgress.find({ userId: new Types.ObjectId(userId), nextReviewDate: { $gt: now } }).populate('topicId').sort({ nextReviewDate: 1 }).limit(10);
  return { due, upcoming };
};

export const getReviewPrediction = async (userId: string, topicId: string) => {
  const p = await StudentProgress.findOne({ userId: new Types.ObjectId(userId), topicId: new Types.ObjectId(topicId) }).populate('topicId');
  if (!p) return { message: 'No data' };
  const days = p.lastReviewDate ? (Date.now() - p.lastReviewDate.getTime()) / 864e5 : 0;
  const cur = calculateRetention(days, p.memoryStrength);
  const predictions = [1,3,7,14,30].map(d => ({ days: d, retentionProbability: Math.round(calculateRetention(days + d, p.memoryStrength)), forgetProbability: Math.round(100 - calculateRetention(days + d, p.memoryStrength)) }));
  return { topicId: p.topicId, currentRetention: Math.round(cur), memoryStrength: p.memoryStrength, mastery: p.mastery, confidence: p.confidence, learningVelocity: p.learningVelocity, predictedForgetDate: p.predictedForgetDate, nextReviewDate: p.nextReviewDate, predictions, recommendation: cur < 60 ? 'Review now to improve retention.' : cur < 80 ? 'Consider reviewing soon.' : 'Good retention! Review later.' };
};

export const getReviewStats = async (userId: string) => {
  const all = await StudentProgress.find({ userId: new Types.ObjectId(userId) }).populate('topicId');
  const n = all.length;
  return {
    totalTopics: n,
    masteredTopics: all.filter(p => p.mastery >= 80).length,
    dueTopics: all.filter(p => p.nextReviewDate && p.nextReviewDate <= new Date()).length,
    avgRetention: n ? Math.round(all.reduce((s, p) => s + p.retentionRate, 0) / n) : 0,
    avgMastery: n ? Math.round(all.reduce((s, p) => s + p.mastery, 0) / n) : 0,
    totalReviews: all.reduce((s, p) => s + p.totalAttempts, 0),
    recentActivity: all.filter(p => p.lastReviewDate).sort((a, b) => b.lastReviewDate!.getTime() - a.lastReviewDate!.getTime()).slice(0, 7).map(p => ({ topic: (p.topicId as any)?.title || 'Unknown', mastery: p.mastery, lastReview: p.lastReviewDate })),
    topicBreakdown: all.map(p => ({ topic: (p.topicId as any)?.title || 'Unknown', mastery: p.mastery, retention: p.retentionRate, nextReview: p.nextReviewDate, confidence: p.confidence })),
  };
};
