import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (!error.response) {
      error.response = {
        data: { success: false, message: error.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running on port 5000?' : `Network error: ${error.message}` },
        status: 0,
      };
    }
    if (error.response.status === 401 && !['/login', '/register', '/'].includes(window.location.pathname)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (d: any) => api.post('/auth/register', d),
  login: (d: { email: string; password: string }) => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (d: any) => api.put('/auth/profile', d),
  getNotifications: () => api.get('/auth/notifications'),
  markNotificationRead: (id: string) => api.put(`/auth/notifications/${id}/read`),
  unlockReward: (rewardId: string, xpCost: number) => api.post('/auth/unlock-reward', { rewardId, xpCost }),
};

export const reviewAPI = {
  logAttempt: (d: any) => api.post('/review/log-attempt', d),
  getQueue: () => api.get('/review/queue'),
  getPrediction: (id: string) => api.get(`/review/prediction?topicId=${id}`),
  getStats: () => api.get('/review/stats'),
};

export const careerAPI = {
  uploadSyllabus: (d: FormData) => api.post('/career/upload-syllabus', d, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  analyze: (d: any) => api.post('/career/analyze', d, { timeout: 120000 }),
  generateRoadmap: (d: any) => api.post('/career/generate-roadmap', d, { timeout: 120000 }),
  getGapAnalysis: (id: string) => api.get(`/career/gap-analysis?careerPathId=${id}`, { timeout: 60000 }),
  getIndustryInsights: (j: string, c: string) => api.get(`/career/industry-insights?dreamJob=${encodeURIComponent(j)}&company=${encodeURIComponent(c)}`, { timeout: 60000 }),
  getPaths: () => api.get('/career/paths'),
  getRoadmaps: () => api.get('/career/roadmaps'),
  importRoadmap: (roadmapId: string) => api.post('/career/import-roadmap', { roadmapId }),
  getSharedRoadmaps: () => api.get('/career/shared-roadmaps'),
  shareRoadmap: (roadmapId: string) => api.post('/career/share-roadmap', { roadmapId }),
};

export const tutorAPI = {
  getTutors: (s?: string) => api.get(`/tutors${s ? `?subject=${encodeURIComponent(s)}` : ''}`),
  registerAsTutor: (d: any) => api.post('/tutors/register', d),
  requestSession: (d: any) => api.post('/tutors/request', d),
  acceptSession: (id: string) => api.post('/tutors/accept', { sessionId: id }),
  rateSession: (d: any) => api.post('/tutors/rate', d),
  getSchedule: () => api.get('/tutors/schedule'),
  getSessions: () => api.get('/tutors/sessions'),
};

export const groupAPI = {
  match: () => api.post('/groups/match'),
  create: (d: any) => api.post('/groups/create', d),
  getGroups: () => api.get('/groups'),
  join: (id: string) => api.post('/groups/join', { groupId: id }),
  scheduleMeeting: (gid: string, d: any) => api.post(`/groups/${gid}/schedule`, d),
  getMeetings: (gid: string) => api.get(`/groups/${gid}/meetings`),
};

export const gameAPI = {
  createFromPDF: (d: FormData) => api.post('/games/from-pdf', d, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }),
  createFromText: (d: any) => api.post('/games/from-text', d),
  getMyGames: () => api.get('/games/my-games'),
  getGame: (id: string) => api.get(`/games/${id}`),
  submit: (d: any) => api.post('/games/submit', d),
  getHistory: () => api.get('/games/history'),
  getLeaderboard: () => api.get('/games/leaderboard'),
  getRecommended: () => api.get('/games/recommended'),
};

export const topicAPI = {
  getProgressDetails: () => api.get('/topics/progress-details'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (p?: any) => api.get('/admin/users', { params: p }),
};

export default api;
