import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { env, hasSupabaseConfig } from '@/src/config/env';

let client: SupabaseClient | null = null;

/**
 * Shared Supabase browser client. Returns null when URL/anon key are not set.
 */
export function getSupabase(): SupabaseClient | null {
  if (!hasSupabaseConfig()) {
    return null;
  }
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce',
      },
    });
  }
  return client;
}
