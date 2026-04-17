import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  LASTFM_API_KEY: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional()
});

export const env = envSchema.parse(process.env);