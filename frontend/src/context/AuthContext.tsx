import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type User
} from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { saveProfile } from '../lib/api';
import { auth, googleProvider } from '../lib/firebase';

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

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
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
  }), []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUp: async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    signInWithGoogle: async () => {
      await signInWithPopup(auth, googleProvider);
    },
    resetPassword: async (email) => {
      await sendPasswordResetEmail(auth, email);
    },
    logout: async () => {
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