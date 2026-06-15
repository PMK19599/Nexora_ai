import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import {
  User,
  StudentProgress,
  ReviewHistory,
  CareerPath,
  CareerMatch,
  Roadmap,
  Resume,
  PeerTutor,
  PeerSession,
  StudyGroup,
  GroupMeeting,
  Notification
} from '../models';
import { Game, GameSession } from '../models/Game';
import { asyncHandler } from '../utils/controllerUtils';

export const exportUserData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  const [
    profile,
    progress,
    reviewHistory,
    careerPaths,
    careerMatches,
    roadmaps,
    resumes,
    tutorProfile,
    peerSessionsAsStudent,
    peerSessionsAsTutor,
    studyGroupsCreated,
    studyGroupsJoined,
    meetingsAttended,
    notifications,
    createdGames,
    gameSessions,
  ] = await Promise.all([
    User.findById(userId).select('-password'),
    StudentProgress.find({ userId }),
    ReviewHistory.find({ userId }),
    CareerPath.find({ userId }),
    CareerMatch.find({ userId }),
    Roadmap.find({ userId }),
    Resume.find({ userId }),
    PeerTutor.find({ userId }),
    PeerSession.find({ studentId: userId }),
    PeerSession.find({ tutorId: userId }),
    StudyGroup.find({ createdBy: userId }),
    StudyGroup.find({ 'members.userId': userId }),
    GroupMeeting.find({ attendees: userId }),
    Notification.find({ userId }),
    Game.find({ userId }),
    GameSession.find({ userId }),
  ]);

  const exportedData = {
    exportTimestamp: new Date(),
    compliance: 'GDPR Article 20 - Right to Data Portability',
    profile,
    progress,
    reviewHistory,
    careerPaths,
    careerMatches,
    roadmaps,
    resumes,
    tutorProfile,
    peerSessions: {
      asStudent: peerSessionsAsStudent,
      asTutor: peerSessionsAsTutor,
    },
    studyGroups: {
      created: studyGroupsCreated,
      joined: studyGroupsJoined,
    },
    meetingsAttended,
    notifications,
    createdGames,
    gameSessions,
  };

  res.status(200).json({ success: true, data: exportedData });
});

export const purgeUserAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  await Promise.all([
    User.findByIdAndDelete(userId),
    StudentProgress.deleteMany({ userId }),
    ReviewHistory.deleteMany({ userId }),
    CareerPath.deleteMany({ userId }),
    CareerMatch.deleteMany({ userId }),
    Roadmap.deleteMany({ userId }),
    Resume.deleteMany({ userId }),
    PeerTutor.deleteMany({ userId }),
    Notification.deleteMany({ userId }),
    Game.deleteMany({ userId }),
    GameSession.deleteMany({ userId }),
  ]);

  await PeerSession.deleteMany({
    $or: [{ studentId: userId }, { tutorId: userId }],
  });

  const groupsUserJoined = await StudyGroup.find({
    'members.userId': userId,
    createdBy: { $ne: userId },
  });

  await Promise.all([
    StudyGroup.deleteMany({ createdBy: userId }),
    ...groupsUserJoined.map((group) => {
      group.members = group.members.filter(
        (m) => m.userId.toString() !== userId.toString()
      );
      return group.save();
    }),
  ]);

  const meetingsUserAttended = await GroupMeeting.find({ attendees: userId });
  await Promise.all(
    meetingsUserAttended.map((meeting) => {
      meeting.attendees = meeting.attendees.filter(
        (id) => id.toString() !== userId.toString()
      );
      return meeting.save();
    })
  );

  res.status(200).json({
    success: true,
    message:
      'Your account and all associated personal data have been permanently purged from the system in compliance with GDPR Article 17 (Right to Erasure).',
  });
});
