import mongoose, { Schema } from 'mongoose';
import { IStudyGroup } from '../types';
const schema = new Schema<IStudyGroup>({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['timekeeper','notetaker','questionmaster','presenter','member'], default: 'member' }, joinedAt: { type: Date, default: Date.now } }],
  maxMembers: { type: Number, default: 6 },
  goals: [String],
  skills: [String],
  timezone: { type: String, default: 'UTC' },
  accessibilityFeatures: [String],
  neurodivergentFriendly: { type: Boolean, default: false },
  schedule: [{ day: String, time: String, duration: { type: Number, default: 60 } }],
  isActive: { type: Boolean, default: true },
  compatibilityScore: Number,
}, { timestamps: true });
schema.index({ isActive: 1 });
schema.index({ 'members.userId': 1 });
export default mongoose.model<IStudyGroup>('StudyGroup', schema);
