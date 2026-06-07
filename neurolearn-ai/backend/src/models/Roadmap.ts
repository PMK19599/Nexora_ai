import mongoose, { Schema } from 'mongoose';
import { IRoadmap } from '../types';
const schema = new Schema<IRoadmap>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  careerPathId: { type: Schema.Types.ObjectId, ref: 'CareerPath', required: true },
  duration: { type: Number, default: 6 },
  months: [{ month: Number, title: String, goals: [String], skills: [String], projects: [String], resources: [String], milestones: [String] }],
  interviewQuestions: [String],
  status: { type: String, enum: ['active','completed','paused'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });
schema.index({ userId: 1, status: 1 });
export default mongoose.model<IRoadmap>('Roadmap', schema);
