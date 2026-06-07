import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccessibilitySettings } from '../types';

const defaults: AccessibilitySettings = { fontSize: 'medium', colorContrast: 'normal', animations: true, readingMode: false, audioMode: false, focusMode: false, fontFamily: 'default', lineSpacing: 'normal', pomodoroEnabled: false, pomodoroWork: 25, pomodoroBreak: 5, reducedDistractions: false, predictableNavigation: false, ttsEnabled: false, ttsSpeed: 1 };
const presets: Record<string, Partial<AccessibilitySettings>> = {
  adhd: { focusMode: true, pomodoroEnabled: true, pomodoroWork: 15, reducedDistractions: true, animations: false },
  autism: { predictableNavigation: true, animations: false, colorContrast: 'high', reducedDistractions: true },
  dyslexia: { fontFamily: 'opendyslexic', lineSpacing: 'wide', ttsEnabled: true, fontSize: 'large', colorContrast: 'high' },
  none: defaults,
};

interface A11yState { settings: AccessibilitySettings; updateSettings: (u: Partial<AccessibilitySettings>) => void; resetSettings: () => void; applyPreset: (t: 'adhd'|'autism'|'dyslexia'|'none') => void; }
export const useAccessibilityStore = create<A11yState>()(persist((set) => ({
  settings: defaults,
  updateSettings: (u) => set(s => ({ settings: { ...s.settings, ...u } })),
  resetSettings: () => set({ settings: defaults }),
  applyPreset: (t) => set(s => ({ settings: { ...s.settings, ...presets[t] } })),
}), { name: 'accessibility-storage' }));
