import { Heart, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatDuration } from '../../lib/music';
import type { MusicTrack } from '../../lib/types';

interface TrackCardProps {
  track: MusicTrack;
  active?: boolean;
  favorite?: boolean;
  onPlay: (track: MusicTrack) => void;
  onFavorite?: (track: MusicTrack) => void;
}

export default function TrackCard({ track, active, favorite, onPlay, onFavorite }: TrackCardProps) {
  const { theme } = useTheme();

  const favoriteClass = favorite
    ? theme === 'light'
      ? 'border-rose-300/70 bg-rose-500/15 text-rose-700'
      : 'border-rose-300/50 bg-rose-400/15 text-rose-200'
    : theme === 'light'
      ? 'border-slate-300/90 bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900'
      : 'border-white/10 bg-white/5 text-white/70 hover:text-white';

  return (
    <article
      className={`music-card group min-w-[168px] max-w-[168px] snap-start rounded-3xl border p-3 transition duration-300 sm:min-w-[220px] sm:max-w-[220px] sm:p-4 ${active ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/5 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/8'}`}
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-900/80">
        <img src={track.cover} alt={track.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        <button
          type="button"
          onClick={() => onPlay(track)}
          aria-label={`Play ${track.title} by ${track.artist}`}
          className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 backdrop-blur-[1px] transition group-hover:opacity-100"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-slate-950 shadow-glow">
            <Play size={20} fill="currentColor" />
          </span>
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="si-font-display truncate text-base font-semibold text-white">{track.title}</h3>
          <p className="mt-1 truncate text-sm text-slate-300">{track.artist}</p>
        </div>
        <button
          type="button"
          onClick={() => onFavorite?.(track)}
          aria-label={`${favorite ? 'Remove' : 'Add'} ${track.title} from favorites`}
          className={`favorite-toggle rounded-full border p-2 transition ${favoriteClass}`}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-400">
        <span className="truncate">{track.album}</span>
        <span>{formatDuration(track.duration)}</span>
      </div>
    </article>
  );
}