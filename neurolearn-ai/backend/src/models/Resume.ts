import mongoose, { Schema } from 'mongoose';
import { IResume } from '../types';
const schema = new Schema<IResume>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  careerPathId: { type: Schema.Types.ObjectId, ref: 'CareerPath' },
  content: {
    name: { type: String, default: '' }, email: { type: String, default: '' }, phone: { type: String, default: '' }, summary: { type: String, default: '' },
    education: [{ institution: String, degree: String, year: String, gpa: String }],
    skills: [{ category: String, items: [String] }],
    projects: [{ name: String, description: String, technologies: [String], link: String }],
    certifications: [{ name: String, issuer: String, date: String }],
    achievements: [String],
    experience: [{ company: String, role: String, duration: String, bullets: [String] }],
  },
  templateId: { type: String, default: 'modern' },
  pdfUrl: String,
}, { timestamps: true });
schema.index({ userId: 1 });
export default mongoose.model<IResume>('Resume', schema);
