import mongoose from 'mongoose';
import { env } from './env.js';

let connected = false;

export async function connectDatabase() {
  if (!env.MONGODB_URI || connected) {
    return connected;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    connected = true;
    return true;
  } catch (error) {
    connected = false;
    console.warn('MongoDB is unavailable. Falling back to in-memory storage.', error);
    return false;
  }
}

export function isDatabaseConnected() {
  return connected;
}