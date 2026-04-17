import cors from 'cors';
import express from 'express';
import { connectDatabase, isDatabaseConnected } from './config/db.js';
import { env } from './config/env.js';
import { optionalAuth } from './middleware/auth.js';
import { createLibraryRouter } from './routes/library.js';
import { musicRouter } from './routes/music.js';
import { memoryStore } from './storage/memory.js';
import { createMongoStore } from './storage/mongo.js';

const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(optionalAuth);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: isDatabaseConnected() ? 'mongo' : 'memory',
    services: {
      youtube: Boolean(env.YOUTUBE_API_KEY),
      lastfm: Boolean(env.LASTFM_API_KEY),
      firebaseAdmin: Boolean(env.FIREBASE_SERVICE_ACCOUNT_JSON || (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY))
    }
  });
});

app.use('/api/music', musicRouter);
app.use('/api/library', createLibraryRouter(env.MONGODB_URI ? createMongoStore() : memoryStore));

const listenOnPort = (port: number) =>
  new Promise<number>((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(port);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      server.close();
      reject(error);
    });
  });

const start = async () => {
  await connectDatabase();

  const maxPortAttempts = 10;
  let port = env.PORT;

  for (let attempt = 0; attempt < maxPortAttempts; attempt += 1) {
    try {
      const activePort = await listenOnPort(port);
      console.log(`SonicFlux API listening on http://localhost:${activePort}`);
      return;
    } catch (error) {
      const listenError = error as NodeJS.ErrnoException;

      if (listenError.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use, trying ${port + 1}...`);
        port += 1;
        continue;
      }

      throw error;
    }
  }

  throw new Error(`Unable to start backend after ${maxPortAttempts} port attempts starting from ${env.PORT}`);
};

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});