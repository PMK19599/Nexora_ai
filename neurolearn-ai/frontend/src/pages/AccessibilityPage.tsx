import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
export default function AccessibilityPage() {
  const { settings: s, updateSettings: up, resetSettings, applyPreset } = useAccessibilityStore();
  const { updateProfile } = useAuthStore();
  const save = async () => { try { await updateProfile({ accessibility: s }); toast.success('Saved!'); } catch { toast.error('Failed'); } };
  return (
    <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">♿ Accessibility Settings</h1><p className="text-muted-foreground">WCAG 2.1 AA compliant</p></div><div className="flex gap-2"><Button variant="outline" onClick={resetSettings}>Reset</Button><Button onClick={save}>💾 Save</Button></div></div>
      <Card><CardHeader><CardTitle>Quick Presets</CardTitle><CardDescription>Apply optimized settings</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3"><Button variant="outline" onClick={()=>{applyPreset('adhd');toast.success('ADHD applied')}}>🔵 ADHD</Button><Button variant="outline" onClick={()=>{applyPreset('autism');toast.success('Autism applied')}}>🟣 Autism</Button><Button variant="outline" onClick={()=>{applyPreset('dyslexia');toast.success('Dyslexia applied')}}>🟢 Dyslexia</Button><Button variant="outline" onClick={()=>{applyPreset('none');toast.success('Default')}}>⬜ Default</Button></CardContent></Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>🎨 Visual</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Font Size</Label><Select value={s.fontSize} onValueChange={(v:any)=>up({fontSize:v})}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem><SelectItem value="xlarge">X-Large</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between"><Label>Contrast</Label><Select value={s.colorContrast} onValueChange={(v:any)=>up({colorContrast:v})}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between"><Label>Font</Label><Select value={s.fontFamily} onValueChange={(v:any)=>up({fontFamily:v})}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="default">Default</SelectItem><SelectItem value="opendyslexic">OpenDyslexic</SelectItem><SelectItem value="arial">Arial</SelectItem><SelectItem value="verdana">Verdana</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between"><Label>Spacing</Label><Select value={s.lineSpacing} onValueChange={(v:any)=>up({lineSpacing:v})}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="wide">Wide</SelectItem><SelectItem value="wider">Wider</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between"><Label htmlFor="anim">Animations</Label><Switch id="anim" checked={s.animations} onCheckedChange={v=>up({animations:v})} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>🎯 Focus & Reading</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label htmlFor="fm">Focus Mode</Label><Switch id="fm" checked={s.focusMode} onCheckedChange={v=>up({focusMode:v})} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="rm">Reading Mode</Label><Switch id="rm" checked={s.readingMode} onCheckedChange={v=>up({readingMode:v})} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="rd">Reduced Distractions</Label><Switch id="rd" checked={s.reducedDistractions} onCheckedChange={v=>up({reducedDistractions:v})} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="pn">Predictable Nav</Label><Switch id="pn" checked={s.predictableNavigation} onCheckedChange={v=>up({predictableNavigation:v})} /></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>🔊 Audio & TTS</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label htmlFor="am">Audio Mode</Label><Switch id="am" checked={s.audioMode} onCheckedChange={v=>up({audioMode:v})} /></div>
          <div className="flex items-center justify-between"><Label htmlFor="tts">Text-to-Speech</Label><Switch id="tts" checked={s.ttsEnabled} onCheckedChange={v=>up({ttsEnabled:v})} /></div>
          {s.ttsEnabled&&<div className="flex items-center justify-between"><Label>Speed</Label><Input type="number" className="w-20" min={0.5} max={2} step={0.1} value={s.ttsSpeed} onChange={e=>up({ttsSpeed:parseFloat(e.target.value)})} /></div>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>⏱️ Pomodoro</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label htmlFor="pe">Enable</Label><Switch id="pe" checked={s.pomodoroEnabled} onCheckedChange={v=>up({pomodoroEnabled:v})} /></div>
          {s.pomodoroEnabled&&<><div className="flex items-center justify-between"><Label>Work (min)</Label><Input type="number" className="w-20" min={5} max={60} value={s.pomodoroWork} onChange={e=>up({pomodoroWork:parseInt(e.target.value)})} /></div><div className="flex items-center justify-between"><Label>Break (min)</Label><Input type="number" className="w-20" min={1} max={30} value={s.pomodoroBreak} onChange={e=>up({pomodoroBreak:parseInt(e.target.value)})} /></div></>}
        </CardContent></Card>
      </div>
    </div>
  );
}
