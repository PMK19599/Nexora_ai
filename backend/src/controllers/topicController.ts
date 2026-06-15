import { Request, Response, NextFunction } from 'express';
import { Topic, StudentProgress } from '../models';
import { Game, GameSession } from '../models/Game';
import { AuthRequest } from '../types';
import { asyncHandler, paginateQuery } from '../utils/controllerUtils';

export const getTopics = asyncHandler(async (req: Request, res: Response) => {
  const { domain, difficulty, search } = req.query;
  const q: any = {};
  if (domain) q.domain = domain; if (difficulty) q.difficulty = difficulty; if (search) q.$text = { $search: search as string };
  const result = await paginateQuery(Topic, q, req);
  res.json({ success: true, data: result.data, pagination: result.pagination });
});

export const getTopic = asyncHandler(async (req: Request, res: Response) => {
  const t = await Topic.findById(req.params.id).populate('prerequisites');
  if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: t });
});

export const createTopic = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(201).json({ success: true, data: await Topic.create(req.body) });
});

export const updateTopic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, data: t });
});

export const deleteTopic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const t = await Topic.findByIdAndDelete(req.params.id);
  if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  res.json({ success: true, message: 'Deleted' });
});

export const getProgressDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const progressList = await StudentProgress.find({ userId }).populate('topicId').lean();
  const myGames = await Game.find({ userId }).select('title sourceType totalQuestions description createdAt sourceChunks').lean();
  const sessions = await GameSession.find({ userId }).populate('gameId').lean();

  const weaknesses: any[] = [];
  const seenQuestions = new Set<string>();

  for (const session of sessions) {
    const gameObj = session.gameId as any;
    if (!gameObj) continue;

    for (const answer of session.answers) {
      if (!answer.correct) {
        const question = gameObj.questions?.[answer.questionIndex];
        if (question) {
          const questionKey = `${gameObj._id}_${answer.questionIndex}`;
          if (!seenQuestions.has(questionKey)) {
            seenQuestions.add(questionKey);
            weaknesses.push({
              gameId: gameObj._id,
              gameTitle: gameObj.title,
              question: question.question,
              selectedAnswerText: question.options?.[answer.selectedAnswer] || 'Your Answer',
              correctAnswerText: question.options?.[question.correctAnswer] || 'Correct Answer',
              explanation: question.explanation,
              points: question.points,
              createdAt: session.createdAt
            });
          }
        }
      }
    }
  }

  res.json({
    success: true,
    data: {
      progress: progressList,
      materials: myGames,
      weaknesses: weaknesses.slice(0, 15)
    }
  });
});
