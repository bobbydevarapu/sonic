import { env } from '../config/env.js';
import type { MusicTrack } from '../types.js';

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  url: string;
}

async function safeJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function mapYouTubeTrack(item: any): MusicTrack {
  return {
    id: `youtube_${item.id.videoId}`,
    title: item.snippet.title ?? 'Unknown title',
    artist: item.snippet.channelTitle ?? 'YouTube',
    album: 'YouTube',
    cover: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
    duration: 0,
    source: 'youtube',
    youtubeVideoId: item.id.videoId,
    description: item.snippet.description?.slice(0, 140) || undefined
  };
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult | null> {
  if (!query.trim()) {
    return null;
  }

  if (!env.YOUTUBE_API_KEY) {
    return null;
  }

  const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
  endpoint.searchParams.set('part', 'snippet');
  endpoint.searchParams.set('type', 'video');
  endpoint.searchParams.set('maxResults', '1');
  endpoint.searchParams.set('q', query);
  endpoint.searchParams.set('key', env.YOUTUBE_API_KEY);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const payload = await safeJson(response);
      const reason = payload?.error?.message ?? 'unknown error';
      console.warn(`[youtube] Search unavailable (${response.status}): ${reason}`);
      return null;
    }

    const payload = await response.json();
    const first = payload.items?.[0];

    if (!first?.id?.videoId) {
      return null;
    }

    return {
      videoId: first.id.videoId,
      title: first.snippet.title,
      thumbnail: first.snippet.thumbnails?.medium?.url ?? first.snippet.thumbnails?.default?.url ?? '',
      channelTitle: first.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${first.id.videoId}`
    };
  } catch (error) {
    console.warn('[youtube] Search request failed', error);
    return null;
  }
}

export async function searchYouTubeTracks(query: string, limit = 12): Promise<MusicTrack[]> {
  if (!query.trim() || !env.YOUTUBE_API_KEY) {
    return [];
  }

  const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
  endpoint.searchParams.set('part', 'snippet');
  endpoint.searchParams.set('type', 'video');
  endpoint.searchParams.set('maxResults', String(Math.min(Math.max(limit, 1), 20)));
  endpoint.searchParams.set('q', query);
  endpoint.searchParams.set('key', env.YOUTUBE_API_KEY);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const payload = await safeJson(response);
      const reason = payload?.error?.message ?? 'unknown error';
      console.warn(`[youtube] Track search unavailable (${response.status}): ${reason}`);
      return [];
    }

    const payload = await response.json();
    return (payload.items ?? [])
      .filter((item: any) => Boolean(item?.id?.videoId && item?.snippet?.title))
      .map(mapYouTubeTrack);
  } catch (error) {
    console.warn('[youtube] Track search request failed', error);
    return [];
  }
}