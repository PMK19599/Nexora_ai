import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';
const schema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['review','tutor','group','career','achievement','system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ userId: 1, read: 1 });
schema.index({ userId: 1, createdAt: -1 });
export default mongoose.model<INotification>('Notification', schema);
