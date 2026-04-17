import { Play } from 'lucide-react';
import { formatDuration } from '../../lib/music';
import type { MusicTrack } from '../../lib/types';

interface MiniTrackRowProps {
  track: MusicTrack;
  active?: boolean;
  onPlay: (track: MusicTrack) => void;
}

export default function MiniTrackRow({ track, active, onPlay }: MiniTrackRowProps) {
  return (
    <button
      type="button"
      onClick={() => onPlay(track)}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${active ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/8 bg-white/5 hover:border-cyan-300/25 hover:bg-white/8'}`}
    >
      <img src={track.cover} alt={track.title} className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{track.title}</p>
        <p className="truncate text-xs text-slate-300">{track.artist}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>{formatDuration(track.duration)}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white">
          <Play size={14} fill="currentColor" />
        </span>
      </div>
    </button>
  );
}