import { env } from '../config/env.js';
import type { MusicTrack } from '../types.js';
import { searchTracks } from './deezer.js';

async function getLastFmTags(track: MusicTrack) {
  if (!env.LASTFM_API_KEY) {
    return [] as string[];
  }

  const endpoint = new URL('https://ws.audioscrobbler.com/2.0/');
  endpoint.searchParams.set('method', 'track.gettoptags');
  endpoint.searchParams.set('api_key', env.LASTFM_API_KEY);
  endpoint.searchParams.set('artist', track.artist);
  endpoint.searchParams.set('track', track.title);
  endpoint.searchParams.set('format', 'json');

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return (payload.toptags?.tag ?? []).slice(0, 6).map((tag: { name: string }) => tag.name);
  } catch {
    return [];
  }
}

export async function getRecommendedTracks(seedTrack?: MusicTrack, query?: string) {
  const tags = seedTrack ? await getLastFmTags(seedTrack) : [];
  const seedTerms = [
    seedTrack?.title,
    seedTrack?.artist,
    ...(seedTrack?.genreTags ?? []),
    ...(query ? [query] : []),
    ...tags,
    'chill',
    'groove'
  ]
    .filter(Boolean)
    .join(' ');

  return searchTracks(seedTerms, 18);
}