# SonicFlux

SonicFlux is a motion-heavy full-stack music web app built with React, Tailwind CSS, Framer Motion, GSAP, Node.js, Express, and optional MongoDB persistence.

## Free APIs
- Deezer for metadata and chart/search data
- YouTube Data API for playback search and embedding
- Last.fm for tag-based recommendations
- Firebase Authentication for sign-in, sign-up, and password reset

## Setup
1. Create backend env from `backend/.env.example` into `backend/.env`.
2. Create frontend env from `frontend/.env.example` into `frontend/.env`.
3. Install dependencies from the repo root.
4. Run `npm run dev`.

## Environment Layout
- Backend-only keys go in `backend/.env`.
- Frontend `VITE_*` keys go in `frontend/.env`.
- Do not place runtime keys in a single root `.env` for this workspace setup.

## Scripts
- `npm run dev` starts the backend on `4000` and the frontend on `5173`
- `npm run build` builds both apps
- `npm run start` starts the backend after building
- `npm run dev --workspace backend` runs backend only
- `npm run dev --workspace frontend` runs frontend only

## Notes
- If `MONGODB_URI` is missing, the backend falls back to in-memory storage for favorites and playlists.
- If `YOUTUBE_API_KEY` is missing, the UI still works but actual YouTube search playback cannot resolve a video.
- Firebase auth needs the frontend config values plus an optional admin service account for backend token verification.