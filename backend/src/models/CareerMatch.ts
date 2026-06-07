import mongoose, { Schema } from 'mongoose';
import { ICareerMatch } from '../types';
const schema = new Schema<ICareerMatch>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  careerPathId: { type: Schema.Types.ObjectId, ref: 'CareerPath', required: true },
  matchedSkills: [String],
  missingSkills: [{ skill: String, priority: { type: String, enum: ['high','medium','low'] }, difficulty: { type: String, enum: ['easy','medium','hard'] }, timeEstimate: String }],
  overallMatch: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });
schema.index({ userId: 1, careerPathId: 1 });
export default mongoose.model<ICareerMatch>('CareerMatch', schema);
