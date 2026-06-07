import { Request, Response, NextFunction } from 'express';
import { Topic, StudentProgress } from '../models';
import { Game, GameSession } from '../models/Game';
import { AuthRequest } from '../types';

export const getTopics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { domain, difficulty, search, page = 1, limit = 20 } = req.query;
    const q: any = {};
    if (domain) q.domain = domain; if (difficulty) q.difficulty = difficulty; if (search) q.$text = { $search: search as string };
    const skip = (Number(page) - 1) * Number(limit);
    const [topics, total] = await Promise.all([Topic.find(q).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }), Topic.countDocuments(q)]);
    res.json({ success: true, data: topics, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (e) { next(e); }
};
export const getTopic = async (req: Request, res: Response, next: NextFunction): Promise<void> => { try { const t = await Topic.findById(req.params.id).populate('prerequisites'); if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; } res.json({ success: true, data: t }); } catch (e) { next(e); } };
export const createTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { res.status(201).json({ success: true, data: await Topic.create(req.body) }); } catch (e) { next(e); } };
export const updateTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { const t = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; } res.json({ success: true, data: t }); } catch (e) { next(e); } };
export const deleteTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => { try { const t = await Topic.findByIdAndDelete(req.params.id); if (!t) { res.status(404).json({ success: false, message: 'Not found' }); return; } res.json({ success: true, message: 'Deleted' }); } catch (e) { next(e); } };

export const getProgressDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
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
  } catch (e) { next(e); }
};
