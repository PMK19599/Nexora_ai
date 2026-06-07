import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { reviewAPI, groupAPI, tutorAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PomodoroTimer from '@/components/common/PomodoroTimer';

const COLORS = ['#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({ queryKey: ['reviewStats'], queryFn: async () => { const { data } = await reviewAPI.getStats(); return data.data; } });
  const { data: groups } = useQuery({ queryKey: ['myGroups'], queryFn: async () => { const { data } = await groupAPI.getGroups(); return data.data; } });
  const { data: sessions } = useQuery({ queryKey: ['mySessions'], queryFn: async () => { const { data } = await tutorAPI.getSessions(); return data.data; } });

  const s = stats || { totalTopics: 0, masteredTopics: 0, dueTopics: 0, avgRetention: 0, avgMastery: 0, totalReviews: 0, topicBreakdown: [] };
  const bars = (s.topicBreakdown || []).slice(0, 6).map((t: any) => ({ name: t.topic?.substring(0, 12) || 'Topic', mastery: t.mastery || 0, retention: t.retention || 0 }));
  const pie = [{ name: 'Mastered', value: s.masteredTopics }, { name: 'Learning', value: Math.max(0, s.totalTopics - s.masteredTopics - s.dueTopics) }, { name: 'Due', value: s.dueTopics }].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.learningTrack === 'neurodivergent'
              ? `Your ${user.neurodivergentType?.toUpperCase()}-optimized dashboard is ready.`
              : "Here's your learning overview for today."}
          </p>
        </div>
        <Link to="/review">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 font-semibold">
            {s.dueTopics > 0 ? `🔔 Review ${s.dueTopics} Due Topics` : '✅ Start Review'}
          </Button>
        </Link>
      </div>

      {/* Pomodoro for ADHD */}
      {user?.neurodivergentType === 'adhd' && user?.accessibility?.pomodoroEnabled !== false && <PomodoroTimer />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Topics', value: s.totalTopics, sub: `${s.masteredTopics} mastered`, icon: '📚', gradient: 'from-violet-500 to-purple-600' },
          { label: 'Avg Retention', value: `${s.avgRetention}%`, sub: 'Memory strength', icon: '🧠', gradient: 'from-blue-500 to-cyan-600' },
          { label: 'Avg Mastery', value: `${s.avgMastery}%`, sub: 'Skill level', icon: '🏆', gradient: 'from-amber-500 to-orange-600' },
          { label: 'Total Reviews', value: s.totalReviews, sub: s.dueTopics > 0 ? `${s.dueTopics} due now!` : 'All caught up ✓', icon: '🔄', gradient: 'from-green-500 to-emerald-600' },
        ].map(card => (
          <Card key={card.label} className="stat-card overflow-hidden border-0 shadow-md">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                <div className={`w-2 bg-gradient-to-b ${card.gradient}`} />
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP & Level */}
      {user && (
        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                  {user.level}
                </div>
                <div>
                  <p className="text-sm text-purple-100">Level {user.level}</p>
                  <p className="text-2xl font-bold">{user.xp} XP</p>
                </div>
              </div>
              <div className="flex-1 w-full md:w-auto">
                <div className="flex justify-between text-sm text-purple-100 mb-1">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{user.xp % 500} / 500 XP</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(user.xp % 500) / 5}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold">{user.streak}</p>
                  <p className="text-xs text-purple-100">Day Streak 🔥</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {bars.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader><CardTitle className="text-lg">📊 Topic Mastery</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bars}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" fontSize={11} /><YAxis domain={[0, 100]} /><Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} /><Bar dataKey="mastery" fill="#7c3aed" name="Mastery %" radius={[6, 6, 0, 0]} /><Bar dataKey="retention" fill="#a78bfa" name="Retention %" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
        {pie.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader><CardTitle className="text-lg">🎯 Learning Status</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={pie} cx="50%" cy="50%" outerRadius={100} innerRadius={60} label dataKey="value" strokeWidth={0}>{pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { to: '/career', i: '🚀', t: 'Career Roadmap', d: 'Plan your dream career path', color: 'from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10' },
          { to: '/tutors', i: '👥', t: 'Find a Tutor', d: sessions?.length ? `${sessions.length} sessions` : 'Connect with experts', color: 'from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10' },
          { to: '/groups', i: '📚', t: 'Study Groups', d: groups?.length ? `${groups.length} groups` : 'Join or create groups', color: 'from-orange-500/5 to-amber-500/5 hover:from-orange-500/10 hover:to-amber-500/10' },
        ].map(c => (
          <Link key={c.to} to={c.to}>
            <Card className={`border-0 shadow-md bg-gradient-to-br ${c.color} transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
              <CardContent className="flex items-center gap-4 p-6">
                <span className="text-4xl">{c.i}</span>
                <div>
                  <h3 className="font-bold">{c.t}</h3>
                  <p className="text-sm text-muted-foreground">{c.d}</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
