export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  previewUrl?: string | null;
  source: 'deezer' | 'youtube' | 'mock';
  youtubeVideoId?: string | null;
  genreTags?: string[];
  description?: string;
}

export interface MusicPlaylist {
  id: string;
  userId: string;
  name: string;
  tracks: MusicTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  favorites: MusicTrack[];
  playlists: MusicPlaylist[];
  updatedAt: string;
}