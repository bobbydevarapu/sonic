import type { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import { env } from '../config/env.js';

let firebaseAdminReady = false;

function initializeFirebaseAdmin() {
  if (firebaseAdminReady) {
    return;
  }

  const serviceAccountJson = env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson))
    });
    firebaseAdminReady = true;
    return;
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    firebaseAdminReady = true;
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  initializeFirebaseAdmin();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? undefined,
      name: decoded.name ?? undefined,
      picture: decoded.picture ?? undefined
    };
  } catch {
    req.user = undefined;
  }

  next();
}

export function resolveUserId(req: Request) {
  return req.user?.uid ?? req.headers['x-user-id']?.toString() ?? 'guest';
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
      };
    }
  }
}