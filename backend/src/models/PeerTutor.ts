import mongoose, { Schema } from 'mongoose';
import { IPeerTutor } from '../types';
const schema = new Schema<IPeerTutor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subjects: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalSessions: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  availability: [{ day: { type: String, enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] }, startTime: String, endTime: String }],
  maxSessionDuration: { type: Number, default: 60 },
  preferredSessionDuration: { type: Number, default: 30 },
  bio: { type: String, default: '' },
  xpEarned: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
schema.index({ subjects: 1, isActive: 1 });
schema.index({ rating: -1 });
export default mongoose.model<IPeerTutor>('PeerTutor', schema);
