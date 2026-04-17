import type { MusicTrack } from './types';

export function formatDuration(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function trackGradient(track?: MusicTrack) {
  if (!track) {
    return 'linear-gradient(135deg, rgba(19, 49, 77, 0.95), rgba(25, 73, 108, 0.85))';
  }

  const seed = `${track.title}${track.artist}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const accent = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 72% 18% / 0.95), hsl(${accent} 72% 28% / 0.88))`;
}