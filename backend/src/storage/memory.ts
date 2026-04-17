import type { MusicPlaylist, MusicTrack, UserProfile } from '../types.js';

export interface LibraryStore {
  getProfile(userId: string): UserProfile | Promise<UserProfile>;
  upsertProfile(profile: Partial<UserProfile> & { userId: string }): UserProfile | Promise<UserProfile>;
  toggleFavorite(userId: string, track: MusicTrack): { favorites: MusicTrack[]; favorite: boolean } | Promise<{ favorites: MusicTrack[]; favorite: boolean }>;
  listFavorites(userId: string): MusicTrack[] | Promise<MusicTrack[]>;
  savePlaylist(userId: string, playlist: Omit<MusicPlaylist, 'userId' | 'createdAt' | 'updatedAt'>): MusicPlaylist | Promise<MusicPlaylist>;
  listPlaylists(userId: string): MusicPlaylist[] | Promise<MusicPlaylist[]>;
  removePlaylist(userId: string, playlistId: string): { playlists: MusicPlaylist[]; removed: boolean } | Promise<{ playlists: MusicPlaylist[]; removed: boolean }>;
}

const profiles = new Map<string, UserProfile>();

function createEmptyProfile(userId: string): UserProfile {
  return {
    userId,
    favorites: [],
    playlists: [],
    updatedAt: new Date().toISOString()
  };
}

export const memoryStore: LibraryStore = {
  async getProfile(userId) {
    const existing = profiles.get(userId);
    if (existing) {
      return existing;
    }

    const profile = createEmptyProfile(userId);
    profiles.set(userId, profile);
    return profile;
  },
  async upsertProfile(profile) {
    const current = profiles.get(profile.userId) ?? createEmptyProfile(profile.userId);
    const next = {
      ...current,
      ...profile,
      favorites: profile.favorites ?? current.favorites,
      playlists: profile.playlists ?? current.playlists,
      updatedAt: new Date().toISOString()
    } satisfies UserProfile;
    profiles.set(profile.userId, next);
    return next;
  },
  async toggleFavorite(userId, track) {
    const profile = await this.getProfile(userId);
    const isFavorite = profile.favorites.some((favorite) => favorite.id === track.id);
    const favorites = isFavorite
      ? profile.favorites.filter((favorite) => favorite.id !== track.id)
      : [track, ...profile.favorites];

    profiles.set(userId, { ...profile, favorites, updatedAt: new Date().toISOString() });
    return { favorites, favorite: !isFavorite };
  },
  async listFavorites(userId) {
    const profile = await this.getProfile(userId);
    return profile.favorites;
  },
  async savePlaylist(userId, playlist) {
    const current = await this.getProfile(userId);
    const existingIndex = current.playlists.findIndex((item) => item.id === playlist.id);
    const nextPlaylist: MusicPlaylist = {
      ...playlist,
      userId,
      createdAt: existingIndex >= 0 ? current.playlists[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const playlists = existingIndex >= 0
      ? current.playlists.map((item, index) => (index === existingIndex ? nextPlaylist : item))
      : [nextPlaylist, ...current.playlists];

    profiles.set(userId, { ...current, playlists, updatedAt: new Date().toISOString() });
    return nextPlaylist;
  },
  async listPlaylists(userId) {
    const profile = await this.getProfile(userId);
    return profile.playlists;
  },
  async removePlaylist(userId, playlistId) {
    const profile = await this.getProfile(userId);
    const playlists = profile.playlists.filter((playlist) => playlist.id !== playlistId);
    const removed = playlists.length !== profile.playlists.length;

    profiles.set(userId, { ...profile, playlists, updatedAt: new Date().toISOString() });
    return { playlists, removed };
  }
};