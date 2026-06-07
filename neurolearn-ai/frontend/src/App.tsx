import { useEffect } from 'react';
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
import AccessibilityPage from './pages/AccessibilityPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

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
  const { loadUser } = useAuthStore();
  const { settings } = useAccessibilityStore();
  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    const r = document.documentElement, b = document.body;
    b.className = b.className.replace(/text-size-\w+/g, '').replace(/line-spacing-\w+/g, '');
    b.classList.add(`text-size-${settings.fontSize}`, `line-spacing-${settings.lineSpacing}`);
    settings.fontFamily === 'opendyslexic' ? b.classList.add('font-dyslexic') : b.classList.remove('font-dyslexic');
    r.classList.remove('dark', 'high-contrast');
    if (settings.colorContrast === 'dark') r.classList.add('dark');
    if (settings.colorContrast === 'high') r.classList.add('high-contrast');
    settings.focusMode ? b.classList.add('focus-mode') : b.classList.remove('focus-mode');
    settings.readingMode ? b.classList.add('reading-mode') : b.classList.remove('reading-mode');
  }, [settings]);

  return (<><a href="#main-content" className="skip-link">Skip to main content</a><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/*" element={<Protected><Layout><Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/career" element={<CareerPage />} />
      <Route path="/tutors" element={<TutorPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/admin" element={<AdminOnly><AdminPage /></AdminOnly>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes></Layout></Protected>} />
  </Routes></>);
}
