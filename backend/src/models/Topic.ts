import mongoose, { Schema } from 'mongoose';
import { ITopic } from '../types';

const topicSchema = new Schema<ITopic>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  domain: { type: String, required: true, index: true },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  estimatedHours: { type: Number, default: 1 },
  tags: [{ type: String }],
  resources: [{ type: { type: String }, url: { type: String }, title: { type: String } }],
}, { timestamps: true });

topicSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<ITopic>('Topic', topicSchema);
