import { PeerTutor, PeerSession, User, StudentProgress } from '../models';
import { Types } from 'mongoose';
import { createNotification } from '../utils/controllerUtils';

export const calculateMatchScore = (tutor: any, student: any, subject: string): number => {
  let score = 0;
  score += tutor.subjects.some((s: string) => s.toLowerCase().includes(subject.toLowerCase())) ? 40 : 10;
  score += (tutor.rating / 5) * 30;
  score += tutor.userId?.timezone === student.timezone ? 15 : 5;
  score += tutor.userId?.communicationStyle === student.communicationStyle ? 15 : tutor.userId?.communicationStyle === 'mixed' ? 10 : 5;
  return Math.round(score);
};

export const findMatchingTutors = async (userId: string, subject: string) => {
  const student = await User.findById(userId);
  if (!student) throw new Error('Student not found');
  const tutors = await PeerTutor.find({ isActive: true, userId: { $ne: new Types.ObjectId(userId) } }).populate('userId', 'name email timezone communicationStyle avatar learningTrack neurodivergentType');
  return tutors.map(t => ({ ...t.toObject(), id: t._id, matchScore: calculateMatchScore(t, student, subject) })).sort((a, b) => b.matchScore - a.matchScore);
};

export const requestSession = async (studentId: string, tutorId: string, subject: string, scheduledAt: string, duration = 30) => {
  const tutor = await PeerTutor.findById(tutorId).populate('userId');
  if (!tutor) throw new Error('Tutor not found');
  const session = await PeerSession.create({ tutorId: (tutor.userId as any)._id, studentId: new Types.ObjectId(studentId), subject, scheduledAt: new Date(scheduledAt), duration, status: 'pending' });
  await createNotification((tutor.userId as any)._id, 'tutor', 'New Tutoring Request', `New request for ${subject}`, { sessionId: session._id });
  return session;
};

export const acceptSession = async (sessionId: string, tutorUserId: string) => {
  const s = await PeerSession.findOneAndUpdate({ _id: sessionId, tutorId: new Types.ObjectId(tutorUserId), status: 'pending' }, { status: 'accepted' }, { new: true });
  if (!s) throw new Error('Session not found');
  await createNotification(s.studentId, 'tutor', 'Session Accepted!', `Your ${s.subject} session was accepted.`, { sessionId: s._id });
  return s;
};

export const rateSession = async (sessionId: string, userId: string, rating: number, feedback: string) => {
  const s = await PeerSession.findOneAndUpdate({ _id: sessionId, studentId: new Types.ObjectId(userId) }, { rating, feedback, status: 'completed' }, { new: true });
  if (!s) throw new Error('Session not found');
  const tutor = await PeerTutor.findOne({ userId: s.tutorId });
  if (tutor) { tutor.totalRatings += 1; tutor.totalSessions += 1; tutor.rating = ((tutor.rating * (tutor.totalRatings - 1)) + rating) / tutor.totalRatings; tutor.xpEarned += 50; await tutor.save(); }
  await User.findByIdAndUpdate(s.tutorId, { $inc: { xp: 50 } });
  return s;
};

export const getTutorSchedule = async (tutorUserId: string) =>
  PeerSession.find({ tutorId: new Types.ObjectId(tutorUserId), status: { $in: ['pending','accepted','active'] } }).populate('studentId', 'name email avatar').sort({ scheduledAt: 1 });
