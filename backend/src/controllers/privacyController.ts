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

/**
 * GET /api/privacy/export-data
 * GDPR Article 20: Right to Data Portability
 * Retrieves and returns all stored personal data associated with the authenticated user.
 */
export const exportUserData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /api/privacy/purge-account
 * GDPR Article 17: Right to Erasure ("Right to be Forgotten")
 * Permanently deletes all personal and educational records across all database collections.
 */
export const purgeUserAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;

    // 1. Delete direct user records, progress, games, and history collections
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

    // 2. PeerSession cleanup (delete sessions where user was student or tutor)
    await PeerSession.deleteMany({
      $or: [{ studentId: userId }, { tutorId: userId }],
    });

    // 3. StudyGroup cleanup
    // - Delete groups created by the user
    // - Remove the user from any other group's members list
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

    // 4. GroupMeeting cleanup
    // - Remove the user from attendees lists of other study groups meetings
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
  } catch (e) {
    next(e);
  }
};
