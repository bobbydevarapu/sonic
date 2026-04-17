import { Pause, Play, SkipBack, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { trackGradient } from '../../lib/music';
import type { MusicTrack } from '../../lib/types';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string | null;
  title: string;
  artist: string;
  cover: string;
  onAutoAdvance?: () => void;
}

function loadYouTubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const existing = document.querySelector('script[data-sonicflux-youtube-api]');
    if (existing) {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.dataset.sonicfluxYoutubeApi = 'true';

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    document.head.appendChild(script);
  });
}

export default function YouTubePlayer({ videoId, title, artist, cover, onAutoAdvance }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<any>(null);
  const volumeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [hasUserActivatedAudio, setHasUserActivatedAudio] = useState(false);

  const accentClass = useMemo(() => {
    const seedTrack = { id: `${title}-${artist}`, title, artist, album: '', cover, duration: 0, source: 'mock' as const } satisfies MusicTrack;
    const gradient = trackGradient(seedTrack);
    let hash = 0;

    for (let index = 0; index < gradient.length; index += 1) {
      hash = gradient.charCodeAt(index) + ((hash << 5) - hash);
    }

    return `player-accent-${Math.abs(hash) % 6}`;
  }, [artist, cover, title]);

  useEffect(() => {
    let active = true;

    const setup = async () => {
      if (!videoId || !playerRef.current) {
        return;
      }

      await loadYouTubeApi();
      if (!active || !playerRef.current) {
        return;
      }

      playerInstance.current?.destroy?.();
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setVolume(0);
            if (!hasUserActivatedAudio) {
              event.target.mute();
            } else if (volumeRef.current > 0) {
              event.target.setVolume(volumeRef.current);
              event.target.unMute();
            }
            event.target.playVideo();
            setDuration(event.target.getDuration() || 0);
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            const state = event.data;
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
            if (state === window.YT.PlayerState.PLAYING || state === window.YT.PlayerState.PAUSED) {
              setDuration(event.target.getDuration() || 0);
            }
            if (state === window.YT.PlayerState.ENDED) {
              onAutoAdvance?.();
            }
          }
        }
      });
    };

    setup().catch(() => {
      setIsReady(false);
    });

    return () => {
      active = false;
      playerInstance.current?.destroy?.();
      playerInstance.current = null;
    };
  }, [hasUserActivatedAudio, onAutoAdvance, videoId]);

  useEffect(() => {
    volumeRef.current = volume;

    if (!playerInstance.current || !isReady) {
      return;
    }

    playerInstance.current.setVolume(volume);
    if (volume === 0) {
      playerInstance.current.mute();
    } else {
      playerInstance.current.unMute();
    }
  }, [isReady, volume]);

  useEffect(() => {
    if (!playerInstance.current) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!playerInstance.current?.getCurrentTime) {
        return;
      }

      setCurrentTime(playerInstance.current.getCurrentTime() || 0);
      setDuration(playerInstance.current.getDuration() || duration);
    }, 300);

    return () => window.clearInterval(timer);
  }, [duration]);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const togglePlayback = () => {
    if (!playerInstance.current || !isReady) {
      return;
    }

    if (!hasUserActivatedAudio) {
      const nextVolume = volumeRef.current > 0 ? volumeRef.current : 80;
      setHasUserActivatedAudio(true);
      setVolume(nextVolume);
      volumeRef.current = nextVolume;
      playerInstance.current.unMute();
      playerInstance.current.setVolume(nextVolume);
    }

    if (isPlaying) {
      playerInstance.current.pauseVideo();
      setIsPlaying(false);
      return;
    }

    playerInstance.current.playVideo();
    setIsPlaying(true);
  };

  const restart = () => {
    if (!playerInstance.current || !isReady) {
      return;
    }

    playerInstance.current.seekTo(0, true);
    playerInstance.current.playVideo();
    setIsPlaying(true);
  };

  const volumeIcon = volume === 0 ? <VolumeX size={16} /> : volume < 50 ? <Volume1 size={16} /> : <Volume2 size={16} />;

  return (
    <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div className="relative min-h-[320px] p-4">
        <div className={`player-accent absolute inset-0 opacity-90 ${accentClass}`} />
        <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-xl" />

        <div className="relative grid gap-4 xl:grid-cols-[1fr_1.15fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/25 p-4 backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/70">
              <div ref={playerRef} className="aspect-video w-full" />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <img src={cover} alt={title} className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-black/30" loading="lazy" />
              <div className="min-w-0">
                <p className="si-font-heading text-xs uppercase tracking-[0.35em] text-cyan-100/80">Now playing</p>
                <h3 className="si-font-display truncate text-xl font-semibold text-white">{title}</h3>
                <p className="truncate text-sm text-slate-200">{artist}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div>
              <p className="si-font-heading text-xs uppercase tracking-[0.35em] text-cyan-100/80">YouTube player</p>
              <h3 className="si-font-display mt-3 text-xl font-semibold text-white sm:text-2xl">Dynamic playback controls</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                The embedded player is driven by the YouTube IFrame API so the interface can handle play, pause, restart, and volume changes without leaving the dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <progress className="player-progress h-2 w-full overflow-hidden rounded-full" value={progress} max={100} />
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300">
                <span>{Math.floor(currentTime)}s</span>
                <span>{Math.floor(duration)}s</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 sm:w-auto"
                >
                  <SkipBack size={16} />
                  Restart
                </button>
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300">
                  <span>Volume</span>
                  <span>{volume}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/80">{volumeIcon}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(event) => {
                      const nextVolume = Number(event.target.value);
                      if (nextVolume > 0) {
                        setHasUserActivatedAudio(true);
                      }
                      setVolume(nextVolume);
                    }}
                    aria-label="Player volume"
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-medium text-white">Playback status</p>
                <p className="mt-1">{isReady ? 'Ready to control the embedded video.' : 'Loading YouTube player…'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}