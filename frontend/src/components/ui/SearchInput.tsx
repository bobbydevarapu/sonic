import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search music, artists, moods...' }: SearchInputProps) {
  const { theme } = useTheme();

  return (
    <label className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:border-cyan-300/40 focus-within:bg-white/8 ${theme === 'light' ? 'border-slate-300 bg-white/85 text-slate-900' : 'border-white/10 bg-white/5 text-white/80'}`}>
      <Search size={18} className={theme === 'light' ? 'text-slate-500' : 'text-current'} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${theme === 'light' ? 'text-slate-900 placeholder:text-slate-500' : 'text-white placeholder:text-slate-400'}`}
      />
    </label>
  );
}