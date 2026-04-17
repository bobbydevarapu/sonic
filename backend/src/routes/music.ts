import { Router } from 'express';
import { demoTracks, getGenres, getTrendingTracks, searchTracks } from '../services/deezer.js';
import { getRecommendedTracks } from '../services/recommendations.js';
import { searchYouTube, searchYouTubeTracks } from '../services/youtube.js';

export const musicRouter = Router();

musicRouter.get('/trending', async (req, res) => {
  const limit = Number(req.query.limit ?? 12);
  const tracks = await getTrendingTracks(limit);
  res.json({ tracks });
});

musicRouter.get('/search', async (req, res) => {
  const query = String(req.query.q ?? '');
  const limit = Number(req.query.limit ?? 12);
  let tracks = await searchTracks(query, limit);

  if (tracks.length === 0) {
    tracks = await searchYouTubeTracks(query, limit);
  }

  res.json({ tracks });
});

musicRouter.get('/suggestions', async (req, res) => {
  const query = String(req.query.q ?? '');
  let tracks = await searchTracks(query, 6);

  if (tracks.length === 0) {
    tracks = await searchYouTubeTracks(query, 6);
  }

  res.json({ suggestions: tracks.map(({ title, artist, cover, id }) => ({ id, title, artist, cover })) });
});

musicRouter.get('/genres', async (_req, res) => {
  const genres = await getGenres();
  res.json({ genres });
});

musicRouter.get('/recommendations', async (req, res) => {
  const seed = String(req.query.seed ?? '');
  const base = demoTracks.find((track) => track.id === seed) ?? demoTracks[0];
  const tracks = await getRecommendedTracks(base, String(req.query.q ?? ''));
  res.json({ tracks });
});

musicRouter.get('/youtube', async (req, res) => {
  const query = String(req.query.q ?? '');
  const result = await searchYouTube(query);
  res.json({ result });
});