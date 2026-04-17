import { Router, type Request, type Response } from 'express';
import { resolveUserId } from '../middleware/auth.js';
import type { LibraryStore } from '../storage/memory.js';
import type { MusicTrack } from '../types.js';

export function createLibraryRouter(store: LibraryStore) {
  const router = Router();

  router.get('/profile', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    Promise.resolve(store.getProfile(userId)).then((profile) => res.json({ profile }));
  });

  router.post('/profile', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    Promise.resolve(
      store.upsertProfile({
        userId,
        email: req.body.email,
        displayName: req.body.displayName,
        photoURL: req.body.photoURL
      })
    ).then((profile) => res.json({ profile }));
  });

  router.get('/favorites', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    Promise.resolve(store.listFavorites(userId)).then((favorites) => res.json({ favorites }));
  });

  router.post('/favorites/toggle', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    const track = req.body.track as MusicTrack;
    Promise.resolve(store.toggleFavorite(userId, track)).then((result) => res.json(result));
  });

  router.get('/playlists', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    Promise.resolve(store.listPlaylists(userId)).then((playlists) => res.json({ playlists }));
  });

  router.post('/playlists', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    Promise.resolve(store.savePlaylist(userId, req.body.playlist)).then((playlist) => res.json({ playlist }));
  });

  router.delete('/playlists/:playlistId', (req: Request, res: Response) => {
    const userId = resolveUserId(req);
    const playlistId = String(req.params.playlistId ?? '');
    Promise.resolve(store.removePlaylist(userId, playlistId)).then((result) => res.json(result));
  });

  return router;
}