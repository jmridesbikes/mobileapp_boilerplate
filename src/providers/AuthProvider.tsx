import type { Session } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { env } from '@/src/config/env';
import type { AuthMode } from '@/src/config/env';
import { getSupabase } from '@/src/lib/supabase';

export type AuthUser = { id: string; email?: string };

export type AuthState = {
  authMode: AuthMode;
  isReady: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  signOut: () => Promise<void>;
  /**
   * Dev-only bypass for `authMode === 'required'` when Supabase is not configured or for quick local testing.
   * No-op when `authMode === 'none'`.
   */
  signInDevBypass: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

function mapUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  return { id: u.id, email: u.email ?? undefined };
}

/**
 * Default: `EXPO_PUBLIC_AUTH_MODE=none` — no login screens. Set `required` for Supabase OAuth (see app/(auth)/login).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(env.authMode === 'none');

  useEffect(() => {
    if (env.authMode === 'none') {
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setUser(null);
      setIsReady(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setUser(mapUser(data.session));
        setIsReady(true);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setUser(mapUser(session));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
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
        signOut: async () => {},
        signInDevBypass,
      };
    }

    return {
      authMode: 'required',
      isReady,
      isAuthenticated: user != null,
      user,
      signOut,
      signInDevBypass,
    };
  }, [user, isReady, signOut, signInDevBypass]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
