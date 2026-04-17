import type { MusicTrack } from '../types.js';

const DEEZER_API = 'https://api.deezer.com';

const demoTracks: MusicTrack[] = [
  {
    id: 'demo-1',
    title: 'Electric Tide',
    artist: 'Sonic Flux',
    album: 'Neon Horizons',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    duration: 215,
    source: 'mock',
    youtubeVideoId: 'dQw4w9WgXcQ',
    genreTags: ['electronic', 'future bass'],
    description: 'A cinematic fallback track used when the public API is unavailable.'
  },
  {
    id: 'demo-2',
    title: 'Midnight Pulse',
    artist: 'Aurora Drive',
    album: 'City Lights',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    duration: 198,
    source: 'mock',
    youtubeVideoId: 'JGwWNGJdvx8',
    genreTags: ['pop', 'synthwave']
  },
  {
    id: 'demo-3',
    title: 'Glass Horizon',
    artist: 'Noir Frequency',
    album: 'Afterglow',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    duration: 241,
    source: 'mock',
    youtubeVideoId: '3JZ4pnNtyxQ',
    genreTags: ['ambient', 'lofi']
  }
];

function mapTrack(track: Record<string, any>): MusicTrack {
  return {
    id: `deezer_${track.id}`,
    title: track.title,
    artist: track.artist?.name ?? track.artist ?? 'Unknown artist',
    album: track.album?.title ?? 'Single',
    cover: track.album?.cover_medium ?? track.album?.cover_big ?? track.album?.cover ?? track.artist?.picture_medium ?? '',
    duration: Number(track.duration ?? 0),
    previewUrl: track.preview ?? null,
    source: 'deezer',
    genreTags: track.genres?.data?.map((genre: { name: string }) => genre.name) ?? [],
    description: track.rank ? `Deezer rank ${track.rank}` : undefined
  };
}

async function requestJson(path: string) {
  const response = await fetch(`${DEEZER_API}${path}`);
  if (!response.ok) {
    throw new Error(`Deezer request failed: ${response.status}`);
  }
  return response.json();
}

export async function getTrendingTracks(limit = 12): Promise<MusicTrack[]> {
  try {
    const payload = await requestJson(`/chart/0/tracks?limit=${limit}`);
    const tracks = (payload.data ?? []).map(mapTrack).filter((track: MusicTrack) => Boolean(track.id && track.title));
    return tracks.length > 0 ? tracks : demoTracks.slice(0, limit);
  } catch {
    return demoTracks.slice(0, limit);
  }
}

export async function searchTracks(query: string, limit = 12): Promise<MusicTrack[]> {
  if (!query.trim()) {
    return getTrendingTracks(limit);
  }

  try {
    const payload = await requestJson(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    const tracks = (payload.data ?? []).map(mapTrack).filter((track: MusicTrack) => Boolean(track.id && track.title));
    if (tracks.length > 0) {
      return tracks;
    }

    const fallbackMatches = demoTracks.filter((track) => {
      const haystack = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    return (fallbackMatches.length > 0 ? fallbackMatches : demoTracks).slice(0, limit);
  } catch {
    const fallbackMatches = demoTracks.filter((track) => {
      const haystack = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    return (fallbackMatches.length > 0 ? fallbackMatches : demoTracks).slice(0, limit);
  }
}

export async function getGenres() {
  try {
    const payload = await requestJson('/genre');
    return (payload.data ?? []).slice(0, 12).map((genre: { id: number; name: string; picture_medium?: string }) => ({
      id: genre.id,
      name: genre.name,
      image: genre.picture_medium
    }));
  } catch {
    return [
      { id: 1, name: 'Electronic', image: demoTracks[0].cover },
      { id: 2, name: 'Pop', image: demoTracks[1].cover },
      { id: 3, name: 'Lo-fi', image: demoTracks[2].cover },
      { id: 4, name: 'Indie', image: demoTracks[0].cover }
    ];
  }
}

export { demoTracks, mapTrack };
