import { useTTS } from '@/hooks/useTTS';
import { Button } from '@/components/ui/button';

interface Props {
  text: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function SpeakButton({ text, className = '', size = 'sm' }: Props) {
  const { toggle, isSpeaking, ttsEnabled } = useTTS();

  if (!ttsEnabled) return null;

  return (
    <Button
      type="button"
      variant={isSpeaking ? 'default' : 'outline'}
      size={size}
      onClick={() => toggle(text)}
      className={`gap-1 ${isSpeaking ? 'animate-pulse bg-teal-500' : ''} ${className}`}
      aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
      title={isSpeaking ? 'Stop reading' : 'Read this aloud'}
    >
      {isSpeaking ? (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg><span className="hidden sm:inline">Stop</span></>
      ) : (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l5.7-4.2c.4-.3.8-.1.8.4v14c0 .5-.4.7-.8.4L6.5 15.2H4c-.6 0-1-.4-1-1v-4.4c0-.6.4-1 1-1h2.5z" /></svg><span className="hidden sm:inline">Listen</span></>
      )}
    </Button>
  );
}
