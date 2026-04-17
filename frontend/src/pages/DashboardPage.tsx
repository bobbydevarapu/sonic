import { ChevronRight, LoaderCircle, LogOut, Music2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CursorTrail from '../components/ui/CursorTrail';
import HorizontalRail from '../components/ui/HorizontalRail';
import MiniTrackRow from '../components/ui/MiniTrackRow';
import NavBar from '../components/ui/NavBar';
import PlaylistRail from '../components/ui/PlaylistRail';
import SearchInput from '../components/ui/SearchInput';
import SectionHeading from '../components/ui/SectionHeading';
import TrackCard from '../components/ui/TrackCard';
import VoiceSearchButton from '../components/ui/VoiceSearchButton';
import YouTubePlayer from '../components/ui/YouTubePlayer';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { getFavorites, getGenres, getPlaylists, getRecommendations, getSuggestions, getTrendingTracks, removePlaylist, savePlaylist, searchTracks, searchYouTube, toggleFavorite } from '../lib/api';
import { trackGradient } from '../lib/music';
import type { GenreItem, MusicPlaylist, MusicTrack, YouTubeSearchResult } from '../lib/types';

const dashboardSections = [
  { id: 'trending', label: 'Trending' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'genres', label: 'Genres' },
  { id: 'favorites', label: 'Favorites' }
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [recommended, setRecommended] = useState<MusicTrack[]>([]);
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [favorites, setFavorites] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [suggestions, setSuggestions] = useState<Array<Pick<MusicTrack, 'id' | 'title' | 'artist' | 'cover'>>>([]);
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [videoResult, setVideoResult] = useState<YouTubeSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [footerLogoMotion, setFooterLogoMotion] = useState<'hidden' | 'visible' | 'reverse'>('hidden');
  const footerLogoRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');

  const debouncedQuery = useDebounce(query, 250);
  const activeGradient = useMemo(() => trackGradient(activeTrack ?? recommended[0] ?? tracks[0]), [activeTrack, recommended, tracks]);
  const playbackQueue = useMemo(() => {
    const nextQueue: MusicTrack[] = [];
    const seen = new Set<string>();
    const candidates = [...tracks, ...recommended, ...favorites];

    for (const track of candidates) {
      if (seen.has(track.id)) {
        continue;
      }
      seen.add(track.id);
      nextQueue.push(track);
    }

    return nextQueue;
  }, [favorites, recommended, tracks]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [trendingTracks, recommendedTracks, genreItems, favoriteTracks, savedPlaylists] = await Promise.all([
        getTrendingTracks(18),
        getRecommendations(undefined, 'future bass chill'),
        getGenres(),
        getFavorites(),
        getPlaylists()
      ]);

      setTracks(trendingTracks);
      setRecommended(recommendedTracks);
      setGenres(genreItems);
      setFavorites(favoriteTracks);
      setPlaylists(savedPlaylists);
      setActiveTrack(trendingTracks[0] ?? recommendedTracks[0] ?? null);
      setLoading(false);
    };

    load().catch(async () => {
      const fallback = await getTrendingTracks(12);
      setTracks(fallback);
      setRecommended(fallback);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const handle = window.setTimeout(async () => {
      const nextSuggestions = await getSuggestions(debouncedQuery);
      setSuggestions(nextSuggestions);
    }, 120);

    return () => window.clearTimeout(handle);
  }, [debouncedQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return;
    }

    let cancelled = false;
    searchTracks(debouncedQuery, 18).then((results) => {
      if (!cancelled) {
        setTracks(results);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!activeTrack) {
      return;
    }

    document.documentElement.style.setProperty('--dashboard-gradient', activeGradient);
    setBusy(true);
    searchYouTube(`${activeTrack.title} ${activeTrack.artist} official audio`)
      .then((result) => setVideoResult(result))
      .finally(() => setBusy(false));
  }, [activeGradient, activeTrack]);

  useEffect(() => {
    if (!mobilePanelOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobilePanelOpen]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setFooterLogoMotion('visible');
      return;
    }

    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollDirectionRef.current = currentY < lastScrollYRef.current ? 'up' : 'down';
      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const section = footerLogoRef.current;
    if (!section) {
      window.removeEventListener('scroll', handleScroll);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterLogoMotion('visible');
          return;
        }

        setFooterLogoMotion(scrollDirectionRef.current === 'up' ? 'reverse' : 'hidden');
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handlePlay = (track: MusicTrack) => {
    setActiveTrack(track);
  };

  const handleAutoAdvance = () => {
    if (!activeTrack || playbackQueue.length < 2) {
      return;
    }

    const currentIndex = playbackQueue.findIndex((track) => track.id === activeTrack.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % playbackQueue.length : 0;
    const nextTrack = playbackQueue[nextIndex];

    if (nextTrack && nextTrack.id !== activeTrack.id) {
      setActiveTrack(nextTrack);
    }
  };

  const handleFavorite = async (track: MusicTrack) => {
    const response = await toggleFavorite(track);
    setFavorites(response.favorites);
  };

  const saveCurrentMix = async () => {
    const playlist = await savePlaylist({
      id: `mix-${Date.now()}`,
      name: query.trim() ? `Search Mix: ${query}` : 'SonicFlux Mix',
      tracks: (tracks.slice(0, 8).length > 0 ? tracks.slice(0, 8) : recommended.slice(0, 8))
    });
    setPlaylists((current) => [playlist, ...current]);
  };

  const handleRemovePlaylist = async (playlistId: string) => {
    const previous = playlists;
    setPlaylists((current) => current.filter((playlist) => playlist.id !== playlistId));

    try {
      const response = await removePlaylist(playlistId);
      setPlaylists(response.playlists);
    } catch {
      setPlaylists(previous);
    }
  };

  const scrollToDashboardSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobilePanelOpen(false);
  };

  return (
    <div className="dashboard-shell si-font-body relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <CursorTrail />
      <NavBar onMenuToggle={() => setMobilePanelOpen((current) => !current)} />

      <div
        className={`dashboard-mobile-overlay fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition md:hidden ${mobilePanelOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setMobilePanelOpen(false)}
      />

      <aside className={`dashboard-mobile-drawer fixed inset-y-0 left-0 z-50 w-[min(84vw,330px)] border-r border-white/10 bg-slate-950/95 px-4 py-5 md:hidden ${mobilePanelOpen ? 'is-open' : ''}`}>
        <div className="no-scrollbar flex h-full flex-col overflow-y-auto pr-1">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">SonicFlux</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Control room</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobilePanelOpen(false)}
                aria-label="Close section panel"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/90 transition hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-300">Quick jump navigation for dashboard sections.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {dashboardSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToDashboardSection(section.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-300/25 hover:bg-white/8"
              >
                {section.label}
                <ChevronRight size={14} />
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="mx-auto grid w-full max-w-[1700px] gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-2 lg:px-5 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="glass-panel hidden self-start rounded-[2rem] p-5 lg:sticky lg:top-24 lg:flex lg:h-fit lg:flex-col lg:gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">SonicFlux</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Music control room</h2>
            <p className="mt-2 text-sm text-slate-300">A glass dashboard for discovery, favorites, and player control.</p>
          </div>

          <nav className="space-y-2">
            {dashboardSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-300/25 hover:bg-white/8"
              >
                {section.label}
                <ChevronRight size={14} />
              </button>
            ))}
          </nav>

          <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Now active</p>
            {activeTrack ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                <img src={activeTrack.cover} alt={activeTrack.title} className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{activeTrack.title}</p>
                  <p className="truncate text-xs text-slate-300">{activeTrack.artist}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Session</p>
            <div className="flex items-center gap-3">
              <img src={user.photoURL ?? 'https://ui-avatars.com/api/?name=SonicFlux&background=0f172a&color=fff'} alt={user.displayName ?? user.email ?? 'User'} className="h-11 w-11 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.displayName ?? 'Listener'}</p>
                <p className="truncate text-xs text-slate-400">{user.email ?? 'No email'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 space-y-3 sm:space-y-4">
          <section className="dashboard-hero glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5 md:p-6" style={{ animationDelay: '40ms' }}>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h1 className="si-font-display mt-3 max-w-full text-[clamp(1.85rem,6.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-3xl md:text-5xl">
                  Find, play, and save music without leaving the interface.
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 md:text-base md:leading-7">
                  Search Deezer metadata in real time, route playback through YouTube, and keep your library synced with Firebase-authenticated user data.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Loaded</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">{tracks.length + recommended.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Favorites</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">{favorites.length}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" style={{ animationDelay: '90ms' }}>
            <div className="flex w-full min-w-0 items-center gap-3">
              <div className="min-w-0 flex-1">
                <SearchInput value={query} onChange={setQuery} />
              </div>
              <div className="shrink-0">
                <VoiceSearchButton onTranscript={setQuery} />
              </div>
            </div>
            {suggestions.length > 0 ? (
              <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => setQuery(`${suggestion.title} ${suggestion.artist}`)}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-left transition hover:border-cyan-300/25 hover:bg-white/8"
                  >
                    <img src={suggestion.cover} alt={suggestion.title} className="h-11 w-11 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{suggestion.title}</p>
                      <p className="truncate text-xs text-slate-300">{suggestion.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="grid min-w-0 items-start gap-3 xl:grid-cols-2">
            <div className="min-w-0 space-y-3">
              <section id="trending" className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" style={{ animationDelay: '140ms' }}>
                <SectionHeading
                  eyebrow="Trending"
                  title="Tracks making the strongest first impression"
                  description="Curated through Deezer charts and smart search fallback when the public API is unavailable."
                />
                {loading ? (
                  <div className="grid place-items-center rounded-3xl border border-white/10 bg-white/5 py-20 text-slate-300">
                    <LoaderCircle className="animate-spin" />
                  </div>
                ) : (
                  <HorizontalRail>
                    {tracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        active={activeTrack?.id === track.id}
                        favorite={favorites.some((favorite) => favorite.id === track.id)}
                        onPlay={handlePlay}
                        onFavorite={handleFavorite}
                      />
                    ))}
                  </HorizontalRail>
                )}
              </section>

              <section id="recommended" className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" style={{ animationDelay: '180ms' }}>
                <SectionHeading
                  eyebrow="Recommended"
                  title="Last.fm tags shape the next wave of suggestions"
                  description="Recommendations generated from selected track signals, artist tags, and your current search mood."
                  action={<button onClick={saveCurrentMix} className="si-font-heading inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 sm:w-auto"><Music2 size={16} />Save Mix</button>}
                />
                <HorizontalRail>
                  {recommended.map((track) => (
                    <TrackCard key={track.id} track={track} active={activeTrack?.id === track.id} favorite={favorites.some((favorite) => favorite.id === track.id)} onPlay={handlePlay} onFavorite={handleFavorite} />
                  ))}
                </HorizontalRail>
              </section>
            </div>

            <div className="min-w-0 space-y-3">
              <section className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" id="player" style={{ animationDelay: '210ms' }}>
                <SectionHeading
                  eyebrow="Player"
                  title="Custom YouTube-backed playback"
                  description="The player loads a matching YouTube video for the selected track and exposes transport and volume controls."
                />
                {activeTrack ? (
                  <YouTubePlayer
                    videoId={videoResult?.videoId ?? activeTrack.youtubeVideoId ?? null}
                    title={activeTrack.title}
                    artist={activeTrack.artist}
                    cover={activeTrack.cover}
                    onAutoAdvance={handleAutoAdvance}
                  />
                ) : null}
                {busy ? <p className="mt-3 text-xs uppercase tracking-[0.35em] text-slate-400">Searching YouTube</p> : null}
              </section>

              <section id="favorites" className="glass-panel sf-animate-in flex min-h-[240px] flex-col rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5 lg:h-[260px] lg:min-h-0" style={{ animationDelay: '250ms' }}>
                <SectionHeading eyebrow="Favorites" title="Saved tracks and playlists" description="A lightweight library surface that persists through the API layer." />
                <div className="favorites-scroll min-h-0 flex-1 space-y-3 overflow-y-scroll pr-2">
                  {favorites.map((track) => (
                    <MiniTrackRow key={track.id} track={track} active={activeTrack?.id === track.id} onPlay={handlePlay} />
                  ))}
                  {favorites.length === 0 ? <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">No favorites yet. Tap the heart on a track to save it.</p> : null}
                </div>
              </section>
            </div>
          </section>

          <section id="genres" className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" style={{ animationDelay: '290ms' }}>
            <SectionHeading eyebrow="Genres" title="Browse by mood and texture" description="Genre tiles sourced from the Deezer public catalog." />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {genres.slice(0, 12).map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => setQuery(genre.name)}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:bg-white/8"
                >
                  {genre.image ? <img src={genre.image} alt={genre.name} className="mb-3 h-24 w-full rounded-2xl object-cover sm:h-28" /> : null}
                  <p className="text-lg font-semibold text-white">{genre.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-panel sf-animate-in rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-5" style={{ animationDelay: '320ms' }}>
            <SectionHeading eyebrow="Library" title="Playlist rail" description="Horizontal browsing built for desktop and mobile gestures." />
            <PlaylistRail
              playlists={playlists}
              onCreateDemo={saveCurrentMix}
              onRemove={handleRemovePlaylist}
            />
          </section>

          <section ref={footerLogoRef} className="sf-animate-in px-4 py-8 text-center sm:px-6 sm:py-10" style={{ animationDelay: '360ms' }}>
            <p className="si-font-heading text-xs uppercase tracking-[0.35em] text-cyan-300/80">SonicFlux</p>
            <h2
              className={`si-font-display sf-footer-logo mt-3 text-[clamp(2.2rem,8vw,5.4rem)] font-black leading-none tracking-[0.08em] ${
                footerLogoMotion === 'visible' ? 'is-visible' : ''
              } ${footerLogoMotion === 'reverse' ? 'is-reverse' : ''}`}
              aria-label="SONICFLUX"
            >
              <span className="sf-footer-logo-left">SONIC</span>
              <span className="sf-footer-logo-right">FLUX</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Music control room, discovery rails, and playback built into one focused dashboard.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}