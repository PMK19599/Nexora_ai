import mongoose, { Schema } from 'mongoose';
import { IPeerSession } from '../types';
const schema = new Schema<IPeerSession>({
  tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic' },
  subject: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','active','completed','cancelled'], default: 'pending' },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  chatMessages: [{ senderId: { type: Schema.Types.ObjectId, ref: 'User' }, message: String, timestamp: { type: Date, default: Date.now } }],
}, { timestamps: true });
schema.index({ tutorId: 1, status: 1 });
schema.index({ studentId: 1, status: 1 });
export default mongoose.model<IPeerSession>('PeerSession', schema);
