import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type AuthProvider,
  type User
} from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { saveProfile } from '../lib/api';
import { auth, firebaseInitError, googleProvider, isFirebaseAuthReady } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const throwUnavailableAuth = () => {
    throw new Error(firebaseInitError ?? 'Firebase authentication is not configured for this environment');
  };

  const requireAuth = (): Auth => {
    if (!auth || !isFirebaseAuthReady) {
      throwUnavailableAuth();
    }

    return auth as Auth;
  };

  useEffect(() => {
    if (!auth || !isFirebaseAuthReady) {
      setUser(null);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        await saveProfile({
          userId: nextUser.uid,
          email: nextUser.email ?? undefined,
          displayName: nextUser.displayName ?? undefined,
          photoURL: nextUser.photoURL ?? undefined
        });
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn: async (email, password) => {
      const authClient = requireAuth();
      await signInWithEmailAndPassword(authClient, email, password);
    },
    signUp: async (email, password) => {
      const authClient = requireAuth();
      await createUserWithEmailAndPassword(authClient, email, password);
    },
    signInWithGoogle: async () => {
      const authClient = requireAuth();
      if (!googleProvider || !isFirebaseAuthReady) {
        throwUnavailableAuth();
      }
      await signInWithPopup(authClient, googleProvider as AuthProvider);
    },
    resetPassword: async (email) => {
      const authClient = requireAuth();
      await sendPasswordResetEmail(authClient, email);
    },
    logout: async () => {
      if (!auth || !isFirebaseAuthReady) {
        return;
      }
      await signOut(auth);
    }
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}