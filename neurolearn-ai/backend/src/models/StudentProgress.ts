import mongoose, { Schema } from 'mongoose';
import { IStudentProgress } from '../types';

const schema = new Schema<IStudentProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  retentionRate: { type: Number, default: 0, min: 0, max: 100 },
  easinessFactor: { type: Number, default: 2.5, min: 1.3 },
  interval: { type: Number, default: 0 },
  repetitions: { type: Number, default: 0 },
  confidence: { type: Number, default: 0, min: 0, max: 100 },
  mastery: { type: Number, default: 0, min: 0, max: 100 },
  predictedForgetDate: { type: Date },
  lastReviewDate: { type: Date },
  nextReviewDate: { type: Date },
  memoryStrength: { type: Number, default: 0 },
  learningVelocity: { type: Number, default: 1 },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  reviewHistory: [{ date: { type: Date, default: Date.now }, quality: { type: Number, min: 0, max: 5 }, responseTime: Number, correct: Boolean }],
}, { timestamps: true });

schema.index({ userId: 1, topicId: 1 }, { unique: true });
schema.index({ userId: 1, nextReviewDate: 1 });
schema.index({ userId: 1, mastery: -1 });

export default mongoose.model<IStudentProgress>('StudentProgress', schema);
