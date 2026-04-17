import mongoose, { Schema } from 'mongoose';
import type { MusicPlaylist, MusicTrack, UserProfile } from '../types.js';
import { memoryStore, type LibraryStore } from './memory.js';

const trackSchema = new Schema<MusicTrack>(
  {
    id: String,
    title: String,
    artist: String,
    album: String,
    cover: String,
    duration: Number,
    previewUrl: String,
    source: String,
    youtubeVideoId: String,
    genreTags: [String],
    description: String
  },
  { _id: false }
);

const playlistSchema = new Schema<MusicPlaylist>(
  {
    id: String,
    userId: String,
    name: String,
    tracks: [trackSchema],
    createdAt: String,
    updatedAt: String
  },
  { _id: false }
);

const userLibrarySchema = new Schema<UserProfile>({
  userId: { type: String, required: true, unique: true },
  email: String,
  displayName: String,
  photoURL: String,
  favorites: [trackSchema],
  playlists: [playlistSchema],
  updatedAt: String
});

const UserLibrary = mongoose.models.UserLibrary ?? mongoose.model('UserLibrary', userLibrarySchema);

function toProfile(document: any): UserProfile {
  return {
    userId: document.userId,
    email: document.email,
    displayName: document.displayName,
    photoURL: document.photoURL,
    favorites: document.favorites ?? [],
    playlists: document.playlists ?? [],
    updatedAt: document.updatedAt ?? new Date().toISOString()
  };
}

export function createMongoStore(): LibraryStore {
  if (mongoose.connection.readyState === 0) {
    return memoryStore;
  }

  return {
    async getProfile(userId) {
      const document = await UserLibrary.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, favorites: [], playlists: [], updatedAt: new Date().toISOString() } },
        { upsert: true, new: true }
      );

      return toProfile(document);
    },
    async upsertProfile(profile) {
      const document = await UserLibrary.findOneAndUpdate(
        { userId: profile.userId },
        { $set: { ...profile, updatedAt: new Date().toISOString() } },
        { upsert: true, new: true }
      );

      return toProfile(document);
    },
    async toggleFavorite(userId, track) {
      const profile = await this.getProfile(userId);
      const isFavorite = profile.favorites.some((favorite) => favorite.id === track.id);
      const favorites = isFavorite
        ? profile.favorites.filter((favorite) => favorite.id !== track.id)
        : [track, ...profile.favorites];

      await UserLibrary.updateOne({ userId }, { $set: { favorites, updatedAt: new Date().toISOString() } });
      return { favorites, favorite: !isFavorite };
    },
    async listFavorites(userId) {
      const profile = await this.getProfile(userId);
      return profile.favorites;
    },
    async savePlaylist(userId, playlist) {
      const profile = await this.getProfile(userId);
      const existingIndex = profile.playlists.findIndex((item) => item.id === playlist.id);
      const nextPlaylist: MusicPlaylist = {
        ...playlist,
        userId,
        createdAt: existingIndex >= 0 ? profile.playlists[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const playlists = existingIndex >= 0
        ? profile.playlists.map((item, index) => (index === existingIndex ? nextPlaylist : item))
        : [nextPlaylist, ...profile.playlists];

      await UserLibrary.updateOne({ userId }, { $set: { playlists, updatedAt: new Date().toISOString() } });
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

      await UserLibrary.updateOne({ userId }, { $set: { playlists, updatedAt: new Date().toISOString() } });
      return { playlists, removed };
    }
  };
}