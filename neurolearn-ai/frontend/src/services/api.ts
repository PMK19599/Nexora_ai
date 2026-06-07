import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // No response at all = network error or server down
    if (!error.response) {
      error.response = {
        data: {
          success: false,
          message: error.code === 'ERR_NETWORK'
            ? '❌ Cannot reach the backend server. Make sure you ran "npm run dev" in the backend folder (port 5000).'
            : error.code === 'ECONNABORTED'
            ? 'Request timed out. The server might be overloaded.'
            : `Network error: ${error.message}`,
        },
        status: 0,
      };
      return Promise.reject(error);
    }

    // Token expired — redirect to login
    if (error.response.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  getNotifications: () => api.get('/auth/notifications'),
  markNotificationRead: (id: string) => api.put(`/auth/notifications/${id}/read`),
};

export const reviewAPI = {
  logAttempt: (data: any) => api.post('/review/log-attempt', data),
  getQueue: () => api.get('/review/queue'),
  getPrediction: (id: string) => api.get(`/review/prediction?topicId=${id}`),
  getStats: () => api.get('/review/stats'),
};

export const careerAPI = {
  uploadSyllabus: (data: FormData) => api.post('/career/upload-syllabus', data, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }),
  analyze: (data: any) => api.post('/career/analyze', data, { timeout: 120000 }),
  generateRoadmap: (data: any) => api.post('/career/generate-roadmap', data, { timeout: 120000 }),
  getGapAnalysis: (id: string) => api.get(`/career/gap-analysis?careerPathId=${id}`, { timeout: 60000 }),
  getIndustryInsights: (j: string, c: string) => api.get(`/career/industry-insights?dreamJob=${encodeURIComponent(j)}&company=${encodeURIComponent(c)}`, { timeout: 60000 }),
  generateResume: (data: any) => api.post('/career/generate-resume', data, { timeout: 120000 }),
  getPaths: () => api.get('/career/paths'),
  getRoadmaps: () => api.get('/career/roadmaps'),
  getResumes: () => api.get('/career/resumes'),
};

export const tutorAPI = {
  getTutors: (subject?: string) => api.get(`/tutors${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`),
  registerAsTutor: (data: any) => api.post('/tutors/register', data),
  requestSession: (data: any) => api.post('/tutors/request', data),
  acceptSession: (id: string) => api.post('/tutors/accept', { sessionId: id }),
  rateSession: (data: any) => api.post('/tutors/rate', data),
  getSchedule: () => api.get('/tutors/schedule'),
  getSessions: () => api.get('/tutors/sessions'),
};

export const groupAPI = {
  match: () => api.post('/groups/match'),
  create: (data: any) => api.post('/groups/create', data),
  getGroups: () => api.get('/groups'),
  join: (id: string) => api.post('/groups/join', { groupId: id }),
  scheduleMeeting: (gid: string, data: any) => api.post(`/groups/${gid}/schedule`, data),
  getMeetings: (gid: string) => api.get(`/groups/${gid}/meetings`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
};

export default api;
