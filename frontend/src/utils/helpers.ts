export const formatDate = (d: string | Date) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
export const getInitials = (n: string) => n.split(' ').map(x => x[0]).join('').toUpperCase().substring(0, 2);
export const getMasteryColor = (m: number) => m >= 80 ? 'text-green-600' : m >= 50 ? 'text-yellow-600' : 'text-red-600';
export const speak = (text: string, speed = 1) => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.rate = speed; window.speechSynthesis.speak(u); } };
export const stopSpeaking = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };

export const speakText = (text: string, speed: number = 1) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[_]{2,}/g, 'blank'));
  u.rate = speed;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(x => x.lang.startsWith('en') && x.name.includes('Google')) || voices.find(x => x.lang.startsWith('en'));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
};
export const stopSpeak = () => window.speechSynthesis?.cancel();

export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

export function extractError(e: any, fallback: string): string {
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.response?.data?.errors?.[0]?.message) return e.response.data.errors[0].message;
  if (e?.message && !e.message.startsWith('Request failed')) return e.message;
  return fallback;
}
