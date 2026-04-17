import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${theme === 'light' ? 'border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50' : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'}`}
    >
      {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}