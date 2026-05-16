import { auth } from './firebase';
import type { GenreItem, MusicPlaylist, MusicTrack, UserProfile, YouTubeSearchResult } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function getAuthHeaders() {
  const user = auth?.currentUser ?? null;
  const token = user ? await user.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : { 'x-user-id': 'guest' };
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? undefined);

  headers.set('Content-Type', 'application/json');

  const authHeaders = await getAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getHealth() {
  return requestJson<{ ok: boolean; database: string; services: Record<string, boolean> }>('/api/health');
}

export async function getTrendingTracks(limit = 12) {
  const response = await requestJson<{ tracks: MusicTrack[] }>(`/api/music/trending?limit=${limit}`);
  return response.tracks;
}

export async function searchTracks(query: string, limit = 12) {
  const response = await requestJson<{ tracks: MusicTrack[] }>(`/api/music/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  return response.tracks;
}

export async function getSuggestions(query: string) {
  const response = await requestJson<{ suggestions: Array<Pick<MusicTrack, 'id' | 'title' | 'artist' | 'cover'>> }>(`/api/music/suggestions?q=${encodeURIComponent(query)}`);
  return response.suggestions;
}

export async function getGenres() {
  const response = await requestJson<{ genres: GenreItem[] }>('/api/music/genres');
  return response.genres;
}

export async function getRecommendations(seed?: string, query?: string) {
  const response = await requestJson<{ tracks: MusicTrack[] }>(`/api/music/recommendations?seed=${encodeURIComponent(seed ?? '')}&q=${encodeURIComponent(query ?? '')}`);
  return response.tracks;
}

export async function searchYouTube(query: string) {
  const response = await requestJson<{ result: YouTubeSearchResult | null }>(`/api/music/youtube?q=${encodeURIComponent(query)}`);
  return response.result;
}

export async function getProfile() {
  const response = await requestJson<{ profile: UserProfile }>('/api/library/profile');
  return response.profile;
}

export async function saveProfile(profile: Partial<UserProfile>) {
  const response = await requestJson<{ profile: UserProfile }>('/api/library/profile', {
    method: 'POST',
    body: JSON.stringify(profile)
  });
  return response.profile;
}

export async function toggleFavorite(track: MusicTrack) {
  const response = await requestJson<{ favorites: MusicTrack[]; favorite: boolean }>('/api/library/favorites/toggle', {
    method: 'POST',
    body: JSON.stringify({ track })
  });
  return response;
}

export async function getFavorites() {
  const response = await requestJson<{ favorites: MusicTrack[] }>('/api/library/favorites');
  return response.favorites;
}

export async function getPlaylists() {
  const response = await requestJson<{ playlists: MusicPlaylist[] }>('/api/library/playlists');
  return response.playlists;
}

export async function savePlaylist(playlist: Partial<MusicPlaylist> & { id: string; name: string; tracks: MusicTrack[] }) {
  const response = await requestJson<{ playlist: MusicPlaylist }>('/api/library/playlists', {
    method: 'POST',
    body: JSON.stringify({ playlist })
  });
  return response.playlist;
}

export async function removePlaylist(playlistId: string) {
  const response = await requestJson<{ playlists: MusicPlaylist[]; removed: boolean }>(`/api/library/playlists/${encodeURIComponent(playlistId)}`, {
    method: 'DELETE'
  });
  return response;
}