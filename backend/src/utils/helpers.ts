import { Response } from 'express';
export const sendSuccess = (res: Response, data: any, code = 200, msg?: string) => res.status(code).json({ success: true, ...(msg && { message: msg }), data });
export const sendError = (res: Response, msg: string, code = 500) => res.status(code).json({ success: false, message: msg });
export const calculateLevel = (xp: number) => Math.floor(xp / 500) + 1;
export const generateXP = (action: string) => ({ review_complete: 10, review_correct: 15, tutor_session: 50, group_meeting: 30, career_roadmap: 20, daily_login: 5 }[action] || 5);
