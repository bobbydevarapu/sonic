import { Mic } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface VoiceSearchButtonProps {
  onTranscript: (value: string) => void;
}

export default function VoiceSearchButton({ onTranscript }: VoiceSearchButtonProps) {
  const { theme } = useTheme();
  const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition
    ?? (window as Window & typeof globalThis & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event: Event & { results: SpeechRecognitionResultList }) => {
      onTranscript(event.results[0][0].transcript);
    };
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition sm:w-auto ${theme === 'light' ? 'border-slate-300 bg-white/85 text-slate-900 hover:bg-white' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
    >
      <Mic size={16} />
      Voice Search
    </button>
  );
}