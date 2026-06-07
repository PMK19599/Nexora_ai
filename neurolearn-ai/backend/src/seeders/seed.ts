import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { User, Topic, StudentProgress, PeerTutor, StudyGroup } from '../models';

const topics = [
  { title: 'Data Structures', description: 'Arrays, linked lists, trees, graphs', domain: 'Computer Science', difficulty: 'beginner', estimatedHours: 40, tags: ['programming','algorithms'] },
  { title: 'Algorithms', description: 'Sorting, searching, dynamic programming', domain: 'Computer Science', difficulty: 'intermediate', estimatedHours: 60, tags: ['programming','algorithms'] },
  { title: 'System Design', description: 'Distributed systems, scalability, caching', domain: 'Computer Science', difficulty: 'advanced', estimatedHours: 50, tags: ['architecture'] },
  { title: 'Calculus', description: 'Limits, derivatives, integrals', domain: 'Mathematics', difficulty: 'intermediate', estimatedHours: 45, tags: ['math'] },
  { title: 'Linear Algebra', description: 'Vectors, matrices, eigenvalues', domain: 'Mathematics', difficulty: 'intermediate', estimatedHours: 35, tags: ['math'] },
  { title: 'Probability & Statistics', description: 'Distributions, hypothesis testing', domain: 'Mathematics', difficulty: 'intermediate', estimatedHours: 40, tags: ['math','statistics'] },
  { title: 'Machine Learning', description: 'Supervised/unsupervised learning, neural networks', domain: 'AI/ML', difficulty: 'advanced', estimatedHours: 80, tags: ['ai','ml'] },
  { title: 'React Development', description: 'Hooks, state management, routing', domain: 'Web Development', difficulty: 'intermediate', estimatedHours: 30, tags: ['react','frontend'] },
  { title: 'Node.js & Express', description: 'REST APIs, middleware', domain: 'Web Development', difficulty: 'intermediate', estimatedHours: 35, tags: ['nodejs','backend'] },
  { title: 'Database Design', description: 'SQL/NoSQL, normalization, indexing', domain: 'Computer Science', difficulty: 'intermediate', estimatedHours: 25, tags: ['database'] },
  { title: 'Cloud Computing', description: 'AWS, GCP, Azure fundamentals', domain: 'DevOps', difficulty: 'intermediate', estimatedHours: 40, tags: ['cloud','devops'] },
  { title: 'Python Programming', description: 'Fundamentals, OOP, libraries', domain: 'Computer Science', difficulty: 'beginner', estimatedHours: 25, tags: ['python'] },
  { title: 'Docker & Kubernetes', description: 'Containerization, orchestration', domain: 'DevOps', difficulty: 'intermediate', estimatedHours: 30, tags: ['docker','kubernetes'] },
  { title: 'NLP', description: 'Text processing, transformers, sentiment analysis', domain: 'AI/ML', difficulty: 'advanced', estimatedHours: 50, tags: ['ai','nlp'] },
  { title: 'Differential Equations', description: 'ODEs, PDEs, Laplace transforms', domain: 'Mathematics', difficulty: 'advanced', estimatedHours: 40, tags: ['math'] },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neurolearn');
    console.log('Connected to MongoDB');
    await Promise.all([User.deleteMany({}), Topic.deleteMany({}), StudentProgress.deleteMany({}), PeerTutor.deleteMany({}), StudyGroup.deleteMany({})]);
    const createdTopics = await Topic.insertMany(topics);
    console.log(`Created ${createdTopics.length} topics`);

    const admin = await User.create({ name: 'Admin User', email: 'admin@neurolearn.ai', password: 'admin123456', role: 'admin', learningTrack: 'normal', neurodivergentType: 'none', skills: ['Management'] });
    const students = await User.create([
      { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', learningTrack: 'normal', neurodivergentType: 'none', skills: ['JavaScript','React','Python'], interests: ['Web Development','ML'], timezone: 'America/New_York' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', learningTrack: 'neurodivergent', neurodivergentType: 'adhd', skills: ['Python','Data Science'], interests: ['AI/ML'], timezone: 'America/Chicago', accessibility: { focusMode: true, pomodoroEnabled: true, pomodoroWork: 15, reducedDistractions: true } },
      { name: 'Carol Davis', email: 'carol@example.com', password: 'password123', learningTrack: 'neurodivergent', neurodivergentType: 'dyslexia', skills: ['Java','SQL'], interests: ['Database Design'], timezone: 'Europe/London', accessibility: { fontFamily: 'opendyslexic', lineSpacing: 'wide', ttsEnabled: true, fontSize: 'large' } },
      { name: 'David Lee', email: 'david@example.com', password: 'password123', learningTrack: 'neurodivergent', neurodivergentType: 'autism', skills: ['C++','Algorithms','System Design'], interests: ['CS','Math'], timezone: 'Asia/Tokyo', accessibility: { predictableNavigation: true, animations: false, colorContrast: 'high' } },
      { name: 'Emma Wilson', email: 'emma@example.com', password: 'password123', learningTrack: 'normal', neurodivergentType: 'none', skills: ['React','Node.js','MongoDB','TypeScript'], interests: ['Full Stack','Cloud'], timezone: 'America/Los_Angeles' },
    ]);

    await StudentProgress.insertMany(createdTopics.slice(0, 5).map((t, i) => ({
      userId: students[0]._id, topicId: t._id, retentionRate: 60 + i * 8, easinessFactor: 2.5 + i * 0.1, interval: i * 3 + 1, repetitions: i + 1, confidence: 50 + i * 10, mastery: 40 + i * 12, memoryStrength: 2 + i * 0.5, learningVelocity: 0.8 + i * 0.05, totalAttempts: 5 + i * 2, correctAttempts: 3 + i * 2, lastReviewDate: new Date(Date.now() - i * 864e5), nextReviewDate: new Date(Date.now() + (i + 1) * 864e5), predictedForgetDate: new Date(Date.now() + (i + 3) * 864e5),
    })));

    await PeerTutor.create({ userId: students[4]._id, subjects: ['React','Node.js','MongoDB','TypeScript'], rating: 4.5, totalSessions: 12, totalRatings: 10, bio: 'Full-stack dev, love helping others!', availability: [{ day: 'monday', startTime: '10:00', endTime: '14:00' }, { day: 'wednesday', startTime: '10:00', endTime: '14:00' }], isActive: true });
    await StudyGroup.create({ name: 'Full Stack Mastery', description: 'Full stack development skills', createdBy: students[0]._id, members: [{ userId: students[0]._id, role: 'presenter' }, { userId: students[4]._id, role: 'timekeeper' }], maxMembers: 6, goals: ['Master React','Build REST APIs'], skills: ['React','Node.js'], isActive: true, schedule: [{ day: 'saturday', time: '10:00', duration: 60 }] });

    console.log('\n✅ Seed completed!');
    console.log('Admin:  admin@neurolearn.ai / admin123456');
    console.log('Users:  alice@example.com / password123');
    console.log('ADHD:   bob@example.com / password123');
    console.log('Dyslx:  carol@example.com / password123');
    console.log('Autism:  david@example.com / password123');
    console.log('Tutor:  emma@example.com / password123');
    process.exit(0);
  } catch (e) { console.error('Seed error:', e); process.exit(1); }
})();
