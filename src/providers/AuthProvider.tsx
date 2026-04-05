import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { env } from '@/src/config/env';
import type { AuthMode } from '@/src/config/env';

export type AuthUser = { id: string; email?: string };

export type AuthState = {
  authMode: AuthMode;
  isReady: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** Placeholder until you wire Supabase/Clerk/etc. */
  signOut: () => void;
  /**
   * Dev-only bypass for `authMode === 'required'` so you can reach the app without a backend.
   * No-op when `authMode === 'none'`.
   */
  signInDevBypass: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Default: `EXPO_PUBLIC_AUTH_MODE=none` — no login screens. Set `required` to show placeholder auth routes.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const signInDevBypass = useCallback(() => {
    if (env.authMode !== 'required') return;
    setUser({ id: 'dev-user', email: 'dev@example.com' });
  }, []);

  const value = useMemo((): AuthState => {
    if (env.authMode === 'none') {
      return {
        authMode: 'none',
        isReady: true,
        isAuthenticated: true,
        user: null,
        signOut,
        signInDevBypass,
      };
    }

    return {
      authMode: 'required',
      isReady: true,
      isAuthenticated: user != null,
      user,
      signOut,
      signInDevBypass,
    };
  }, [user, signOut, signInDevBypass]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
