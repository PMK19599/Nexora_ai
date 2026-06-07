import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-float">🧠</span>
            <span className="text-xl font-bold gradient-text">NeuroLearn AI</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login"><Button variant="ghost" className="font-semibold">Log In</Button></Link>
            <Link to="/register"><Button className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 font-semibold">Get Started Free</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 auth-bg" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-8 border border-violet-200">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            AI-Powered Adaptive Learning Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Learn Smarter<br />
            <span className="gradient-text">Not Harder</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            The first AI learning platform built for <strong>every mind</strong>. Personalized study paths, 
            career roadmaps, and peer tutoring — with full accessibility for neurodivergent learners.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/30 font-semibold rounded-xl">
                Start Learning Free →
              </Button>
            </Link>
            <Link to="/register?track=neurodivergent">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 font-semibold rounded-xl border-2 hover:bg-violet-50">
                ♿ Accessibility Mode
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { n: '10K+', l: 'Active Learners' },
              { n: '98%', l: 'Retention Rate' },
              { n: '4.9★', l: 'User Rating' },
              { n: '24/7', l: 'AI Assistance' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-bold gradient-text">{s.n}</div>
                <div className="text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-violet-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Every Learner</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Four pillars of intelligent learning, each powered by AI.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { i: '🧠', t: 'AI Spaced Repetition', d: 'SM-2 algorithm with Ebbinghaus curves predicts exactly when you\'ll forget — and reminds you.', color: 'from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20' },
              { i: '🚀', t: 'Career Roadmaps', d: 'Upload syllabus, pick dream job. AI generates 6-month plan with gap analysis & resume builder.', color: 'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20' },
              { i: '👥', t: 'Peer Teaching', d: 'Auto-match top performers with students. Built-in chat, scheduling, XP rewards & rating.', color: 'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20' },
              { i: '📚', t: 'Smart Study Groups', d: 'AI matches by skills, goals, timezone & accessibility. Roles auto-assigned per group.', color: 'from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20' },
            ].map(f => (
              <div key={f.t} className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="text-4xl mb-4">{f.i}</div>
                <h3 className="text-lg font-bold mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Track */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Tracks, <span className="gradient-text">One Platform</span></h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-3">📘 Standard Track</h3>
              <ul className="space-y-4">{['Long-term knowledge retention', 'Exam-focused preparation', 'Career readiness roadmaps', 'Competitive peer benchmarking', 'Advanced analytics dashboard'].map(x =>
                <li key={x} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div><span className="text-gray-700">{x}</span></li>
              )}</ul>
            </div>
            <div className="rounded-2xl p-8 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-3">♿ Neurodivergent Track</h3>
              <ul className="space-y-4">{['🔵 ADHD: Focus mode & Pomodoro timer', '🟣 Autism: Predictable nav & schedules', '🟢 Dyslexia: OpenDyslexic font & TTS', 'Structured inclusive collaboration', 'Community support & mentoring'].map(x =>
                <li key={x} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0"><svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div><span className="text-gray-700">{x}</span></li>
              )}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl p-12 md:p-16 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Learn Smarter?</h2>
              <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">Join NeuroLearn AI today. Free forever for students.</p>
              <Link to="/register"><Button size="lg" className="text-lg px-12 py-7 bg-white text-violet-700 hover:bg-gray-50 font-bold rounded-xl shadow-2xl">Create Free Account →</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>🧠</span>
          <span className="font-bold gradient-text">NeuroLearn AI</span>
        </div>
        <p>© 2026 NeuroLearn AI. Built with ❤️ for every mind.</p>
      </footer>
    </div>
  );
}
