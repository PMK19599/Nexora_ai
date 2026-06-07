import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const C = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'];
export default function AdminPage() {
  const { data: d } = useQuery({ queryKey: ['adminDash'], queryFn: async () => { const { data } = await adminAPI.getDashboard(); return data.data; } });
  const { data: ud } = useQuery({ queryKey: ['adminUsers'], queryFn: async () => { const { data } = await adminAPI.getUsers({ limit: 10 }); return data; } });
  const s = d || {}; const td = (s.trackDistribution||[]).map((t:any)=>({name:t._id,value:t.count})); const nd = (s.neurodivergentDistribution||[]).map((t:any)=>({name:t._id,value:t.count})); const gd = (s.userGrowth||[]).slice(0,14).reverse();
  return (
    <div className="space-y-6"><h1 className="text-3xl font-bold">⚙️ Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[{l:'Users',v:s.totalUsers||0,i:'👥'},{l:'Online',v:s.activeUsers||0,i:'🟢'},{l:'Topics',v:s.totalTopics||0,i:'📚'},{l:'Tutors',v:s.totalTutors||0,i:'🎓'},{l:'Groups',v:s.totalGroups||0,i:'📖'},{l:'Sessions',v:s.totalSessions||0,i:'💬'},{l:'Careers',v:s.totalCareerPaths||0,i:'🚀'},{l:'ND Users',v:s.neurodivergentUsers||0,i:'♿'}].map(x=><Card key={x.l}><CardContent className="flex items-center gap-3 pt-6"><span className="text-3xl">{x.i}</span><div><p className="text-2xl font-bold">{x.v}</p><p className="text-sm text-muted-foreground">{x.l}</p></div></CardContent></Card>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        {gd.length>0&&<Card><CardHeader><CardTitle>User Growth</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={gd}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" fontSize={10} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>}
        <Card><CardHeader><CardTitle>Distribution</CardTitle></CardHeader><CardContent><div className="flex items-center justify-around"><ResponsiveContainer width="50%" height={200}><PieChart><Pie data={td} cx="50%" cy="50%" outerRadius={70} label dataKey="value">{td.map((_:any,i:number)=><Cell key={i} fill={C[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><ResponsiveContainer width="50%" height={200}><PieChart><Pie data={nd} cx="50%" cy="50%" outerRadius={70} label dataKey="value">{nd.map((_:any,i:number)=><Cell key={i} fill={C[i+2]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Recent Users</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Track</th><th className="text-left p-2">Type</th><th className="text-left p-2">Level</th><th className="text-left p-2">Status</th></tr></thead><tbody>{(ud?.data||[]).map((u:any)=><tr key={u._id} className="border-b hover:bg-accent"><td className="p-2 font-medium">{u.name}</td><td className="p-2 text-muted-foreground">{u.email}</td><td className="p-2"><Badge variant="outline">{u.learningTrack}</Badge></td><td className="p-2">{u.neurodivergentType!=='none'?<Badge variant="secondary">{u.neurodivergentType}</Badge>:'-'}</td><td className="p-2">Lv.{u.level}</td><td className="p-2">{u.isOnline?<Badge variant="success">Online</Badge>:<Badge variant="outline">Offline</Badge>}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
