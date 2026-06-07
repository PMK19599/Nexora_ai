import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Notification } from '../types';
import { authAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: Notification[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  unlockReward: (rewardId: string, xpCost: number) => Promise<void>;
}

// Extract best error message from any error shape
function extractError(e: any, fallback: string): string {
  // Axios error with backend message
  if (e?.response?.data?.message) return e.response.data.message;
  // Axios error array
  if (e?.response?.data?.errors?.[0]?.message) return e.response.data.errors[0].message;
  // Plain error message (not the useless "Request failed with status code X")
  if (e?.message && !e.message.startsWith('Request failed')) return e.message;
  return fallback;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, token: null, isAuthenticated: false, isLoading: false,
      notifications: [], unreadCount: 0,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login({ email, password });
          localStorage.setItem('token', data.token);
          try { connectSocket(data.token); } catch {}
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false });
          throw new Error(extractError(e, 'Login failed. Check your email and password.'));
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.register(userData);
          localStorage.setItem('token', data.token);
          try { connectSocket(data.token); } catch {}
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ isLoading: false });
          throw new Error(extractError(e, 'Registration failed. Please try again.'));
        }
      },

      logout: async () => {
        try { await authAPI.logout(); } catch {}
        localStorage.removeItem('token');
        try { disconnectSocket(); } catch {}
        set({ user: null, token: null, isAuthenticated: false, notifications: [], unreadCount: 0 });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) { set({ isAuthenticated: false, isLoading: false }); return; }
        set({ isLoading: true });
        try {
          const { data } = await authAPI.getMe();
          try { connectSocket(token); } catch {}
          set({ user: data.user, token, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateProfile: async (d) => {
        const { data } = await authAPI.updateProfile(d);
        set({ user: data.user });
      },

      fetchNotifications: async () => {
        try {
          const { data } = await authAPI.getNotifications();
          const n = data.notifications || [];
          set({ notifications: n, unreadCount: n.filter((x: Notification) => !x.read).length });
        } catch {}
      },

      markNotificationRead: async (id) => {
        try {
          await authAPI.markNotificationRead(id);
          const ns = get().notifications.map(n => n._id === id || id === 'all' ? { ...n, read: true } : n);
          set({ notifications: ns, unreadCount: ns.filter(n => !n.read).length });
        } catch {}
      },
      
      unlockReward: async (rewardId, xpCost) => {
        const { data } = await authAPI.unlockReward(rewardId, xpCost);
        set({ user: data.user });
      },
    }),
    { name: 'nexora-auth', partialize: (s) => ({ token: s.token }) }
  )
);
