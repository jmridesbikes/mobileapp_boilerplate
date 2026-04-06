import type { Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { getSupabase } from '@/src/lib/supabase';

/**
 * PKCE OAuth: open provider in a browser session, then exchange the callback code for a session.
 * @returns `null` on success or user cancel; otherwise an error message.
 */
export async function signInWithOAuthProvider(provider: Provider): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return 'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.';
  }

  const redirectTo = Linking.createURL('auth/callback');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) return error.message;
  if (!data?.url) return 'No OAuth URL returned.';

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    return null;
  }

  try {
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) return exchangeError.message;
      return null;
    }
    return 'Could not complete sign-in (missing authorization code in callback).';
  } catch {
    return 'Could not parse OAuth callback URL.';
  }
}
