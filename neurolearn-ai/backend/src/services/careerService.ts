import pdfParse from 'pdf-parse';
import fs from 'fs';
import { askClaudeJSON } from '../config/claude';
import { CareerPath, CareerMatch, Roadmap, Resume, User } from '../models';
import { Types } from 'mongoose';

export const parseSyllabus = async (filePath: string) => {
  const pdf = await pdfParse(fs.readFileSync(filePath));
  const parsed = await askClaudeJSON<{ concepts: string[]; chapters: string[]; prerequisites: string[]; domain: string }>(
    `Parse this syllabus and extract:\n${pdf.text.substring(0, 8000)}\nReturn JSON: { "concepts":[], "chapters":[], "prerequisites":[], "domain":"" }`,
    'You are an expert curriculum analyzer. Respond with valid JSON only.'
  );
  fs.unlinkSync(filePath);
  return parsed;
};

export const analyzeCareer = async (userId: string, dreamJob: string, company: string, userSkills: string[]) => {
  const analysis = await askClaudeJSON<{ requiredSkills: string[]; industryExpectations: string[]; interviewTopics: string[]; techStack: string[] }>(
    `Analyze career requirements for "${dreamJob}" at "${company}". Student skills: ${userSkills.join(', ') || 'None'}. Return JSON: { "requiredSkills":[], "industryExpectations":[], "interviewTopics":[], "techStack":[] }`,
    'You are a career advisor. Respond with valid JSON only.'
  );
  return CareerPath.create({ userId: new Types.ObjectId(userId), dreamJob, company, parsedSyllabus: { concepts: [], chapters: [], prerequisites: [], domain: '' }, ...analysis });
};

export const uploadAndAnalyzeSyllabus = async (userId: string, filePath: string, dreamJob: string, company: string) => {
  const parsed = await parseSyllabus(filePath);
  const analysis = await askClaudeJSON<{ requiredSkills: string[]; industryExpectations: string[]; interviewTopics: string[]; techStack: string[] }>(
    `Syllabus domain: ${parsed.domain}, concepts: ${parsed.concepts.join(', ')}. Target: "${dreamJob}" at "${company}". Return JSON: { "requiredSkills":[], "industryExpectations":[], "interviewTopics":[], "techStack":[] }`,
    'You are a career advisor. Respond with valid JSON only.'
  );
  return CareerPath.create({ userId: new Types.ObjectId(userId), dreamJob, company, parsedSyllabus: parsed, ...analysis });
};

export const getGapAnalysis = async (userId: string, careerPathId: string) => {
  const cp = await CareerPath.findById(careerPathId);
  const user = await User.findById(userId);
  if (!cp || !user) throw new Error('Not found');
  const analysis = await askClaudeJSON<{ matchedSkills: string[]; missingSkills: { skill: string; priority: string; difficulty: string; timeEstimate: string }[]; overallMatch: number }>(
    `Compare student skills [${user.skills.join(', ') || 'None'}] with required for ${cp.dreamJob} at ${cp.company}: [${cp.requiredSkills.join(', ')}]. Return JSON: { "matchedSkills":[], "missingSkills":[{"skill":"","priority":"high|medium|low","difficulty":"easy|medium|hard","timeEstimate":""}], "overallMatch":45 }`,
    'You are a career gap analyzer. Respond with valid JSON only.'
  );
  return CareerMatch.findOneAndUpdate({ userId: new Types.ObjectId(userId), careerPathId: new Types.ObjectId(careerPathId) }, analysis, { upsert: true, new: true });
};

export const generateRoadmap = async (userId: string, careerPathId: string, duration = 6) => {
  const cp = await CareerPath.findById(careerPathId);
  const gap = await CareerMatch.findOne({ userId: new Types.ObjectId(userId), careerPathId: new Types.ObjectId(careerPathId) });
  if (!cp) throw new Error('Not found');
  const missing = gap?.missingSkills.map(s => s.skill).join(', ') || cp.requiredSkills.join(', ');
  const data = await askClaudeJSON<{ months: { month: number; title: string; goals: string[]; skills: string[]; projects: string[]; resources: string[]; milestones: string[] }[]; interviewQuestions: string[] }>(
    `Create ${duration}-month roadmap for ${cp.dreamJob} at ${cp.company}. Skills: ${missing}. Tech: ${cp.techStack.join(', ')}. Return JSON: { "months":[{"month":1,"title":"","goals":[],"skills":[],"projects":[],"resources":[],"milestones":[]}], "interviewQuestions":[] }. Create exactly ${duration} months.`,
    'You are a career roadmap expert. Respond with valid JSON only.', 8192
  );
  return Roadmap.create({ userId: new Types.ObjectId(userId), careerPathId: new Types.ObjectId(careerPathId), duration, ...data });
};

export const getIndustryInsights = async (dreamJob: string, company: string) =>
  askClaudeJSON<{ salaryRange: string; growthOutlook: string; topCompanies: string[]; emergingTrends: string[]; certifications: string[]; communityResources: string[] }>(
    `Industry insights for "${dreamJob}" at "${company}". Return JSON: { "salaryRange":"", "growthOutlook":"", "topCompanies":[], "emergingTrends":[], "certifications":[], "communityResources":[] }`,
    'You are an industry analyst. Respond with valid JSON only.'
  );

export const generateResume = async (userId: string, careerPathId?: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Not found');
  let ctx = '';
  if (careerPathId) { const c = await CareerPath.findById(careerPathId); if (c) ctx = `Target: ${c.dreamJob} at ${c.company}. Skills needed: ${c.requiredSkills.join(', ')}`; }
  const rc = await askClaudeJSON<{ summary: string; skills: { category: string; items: string[] }[]; projects: { name: string; description: string; technologies: string[] }[] }>(
    `ATS resume for ${user.name} (${user.email}). Skills: ${user.skills.join(', ') || 'TBD'}. ${ctx}. Return JSON: { "summary":"", "skills":[{"category":"","items":[]}], "projects":[{"name":"","description":"","technologies":[]}] }`,
    'You are an expert resume writer. Respond with valid JSON only.'
  );
  return Resume.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, { userId: new Types.ObjectId(userId), careerPathId: careerPathId ? new Types.ObjectId(careerPathId) : undefined, content: { name: user.name, email: user.email, phone: '', summary: rc.summary, education: [], skills: rc.skills, projects: rc.projects, certifications: [], achievements: [], experience: [] } }, { upsert: true, new: true });
};
