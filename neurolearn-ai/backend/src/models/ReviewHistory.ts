import mongoose, { Schema } from 'mongoose';
import { IReviewHistory } from '../types';
const schema = new Schema<IReviewHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  quality: { type: Number, required: true, min: 0, max: 5 },
  responseTime: { type: Number, required: true },
  correct: { type: Boolean, required: true },
  previousInterval: { type: Number, default: 0 },
  newInterval: { type: Number, default: 0 },
  previousEasiness: { type: Number, default: 2.5 },
  newEasiness: { type: Number, default: 2.5 },
}, { timestamps: true });
schema.index({ userId: 1, topicId: 1 });
export default mongoose.model<IReviewHistory>('ReviewHistory', schema);
