import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { MusicPlaylist } from '../../lib/types';

interface PlaylistRailProps {
  playlists: MusicPlaylist[];
  onCreateDemo: () => void;
  onRemove: (playlistId: string) => void;
}

export default function PlaylistRail({ playlists, onCreateDemo, onRemove }: PlaylistRailProps) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:gap-4">
        {playlists.map((playlist) => (
          <article key={playlist.id} className="min-w-[190px] rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:min-w-[260px]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="si-font-heading text-xs uppercase tracking-[0.35em] text-cyan-200/70">Playlist</p>
                <h3 className="si-font-display mt-3 text-lg font-semibold text-white">{playlist.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{playlist.tracks.length} tracks</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(playlist.id)}
                aria-label={`Remove playlist ${playlist.name}`}
                className={`rounded-full border p-2 transition ${theme === 'light' ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        onClick={onCreateDemo}
        className={`si-font-heading inline-flex w-full items-center justify-center gap-2 rounded-[1.5rem] border border-dashed px-4 py-4 text-sm uppercase tracking-[0.12em] transition lg:py-6 ${theme === 'light' ? 'border-cyan-500/35 bg-cyan-500/15 text-cyan-900 hover:bg-cyan-500/20' : 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15'}`}
      >
        <Plus size={16} />
        Save Current Mix
      </button>
    </div>
  );
}