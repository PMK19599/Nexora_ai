import mongoose, { Schema } from 'mongoose';
import { IGroupMeeting } from '../types';
const schema = new Schema<IGroupMeeting>({
  groupId: { type: Schema.Types.ObjectId, ref: 'StudyGroup', required: true },
  title: { type: String, required: true },
  agenda: [String],
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  notes: { type: String, default: '' },
  status: { type: String, enum: ['scheduled','active','completed','cancelled'], default: 'scheduled' },
}, { timestamps: true });
schema.index({ groupId: 1, scheduledAt: 1 });
export default mongoose.model<IGroupMeeting>('GroupMeeting', schema);
