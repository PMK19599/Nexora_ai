import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useAccessibilityStore } from './stores/accessibilityStore';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReviewPage from './pages/ReviewPage';
import CareerPage from './pages/CareerPage';
import TutorPage from './pages/TutorPage';
import GroupsPage from './pages/GroupsPage';
import GamePage from './pages/GamePage';
import AccessibilityPage from './pages/AccessibilityPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

const ALL_ACCESSIBILITY_CLASSES = [
  'font-size-large', 'font-size-xlarge',
  'font-dyslexic', 'font-clean',
  'line-spacing-wide', 'line-spacing-extra',
  'focus-mode-active', 'reduced-motion-active', 'high-contrast-active'
];

export const AccessibilityLifecycleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useAccessibilityStore();

  useEffect(() => {
    const body = document.body;

    // Direct, surgical cleaning routine
    ALL_ACCESSIBILITY_CLASSES.forEach(cls => body.classList.remove(cls));

    // Dynamic state application pipeline
    if (settings.fontSize === 'large') body.classList.add('font-size-large');
    if (settings.fontSize === 'xlarge') body.classList.add('font-size-xlarge');
    if (settings.fontFamily === 'opendyslexic') {
      body.style.fontFamily = 'OpenDyslexic, sans-serif';
    } else {
      body.style.fontFamily = ''; // Revert back to Tailwind defaults safely
    }
    if (settings.lineSpacing === 'extra') body.classList.add('line-spacing-extra');
    if (settings.focusMode) body.classList.add('focus-mode-active');
    if (settings.highContrast) body.classList.add('high-contrast-active');

    // Theme / Color Contrast Application (keep the theme styling working from the original App.tsx)
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast', 'cyberpunk', 'cosmic');
    if (settings.colorContrast === 'dark') root.classList.add('dark');
    if (settings.colorContrast === 'high' || settings.highContrast) root.classList.add('high-contrast');
    if (settings.colorContrast === 'cyberpunk') root.classList.add('cyberpunk');
    if (settings.colorContrast === 'cosmic') root.classList.add('cosmic');

    // Also support focus-mode class
    if (settings.focusMode) {
      body.classList.add('focus-mode');
    } else {
      body.classList.remove('focus-mode');
    }

    // Return an explicit unmount payload to kill class memory leaks
    return () => {
      ALL_ACCESSIBILITY_CLASSES.forEach(cls => body.classList.remove(cls));
      body.classList.remove('focus-mode');
      body.style.fontFamily = '';
      root.classList.remove('dark', 'high-contrast', 'cyberpunk', 'cosmic');
    };
  }, [settings]);

  return <>{children}</>;
};

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  const { loadUser, user } = useAuthStore();
  const store = useAccessibilityStore();
  const { updateSettings } = store;

  useEffect(() => { loadUser(); }, [loadUser]);

  // Sync DB accessibility settings to Zustand store
  useEffect(() => {
    if (user?.accessibility) {
      const keys = Object.keys(user.accessibility) as Array<keyof typeof user.accessibility>;
      const differs = keys.some(
        (key) => user.accessibility[key] !== (store as any)[key]
      );
      if (differs) {
        updateSettings(user.accessibility);
      }
    }
  }, [user?.accessibility, store, updateSettings]);

  return (
    <AccessibilityLifecycleWrapper>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<Protected><Layout><Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/tutors" element={<TutorPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/admin" element={<AdminOnly><AdminPage /></AdminOnly>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes></Layout></Protected>} />
      </Routes>
    </AccessibilityLifecycleWrapper>
  );
}
