import type { Provider } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { hasSupabaseConfig } from '@/src/config/env';
import { signInWithOAuthProvider } from '@/src/lib/auth/oauth';
import { useAuth } from '@/src/providers/AuthProvider';

type Props = {
  title: string;
  body: string;
  /** When set, shown in __DEV__ when `authMode === 'required'`. */
  onDevBypass?: () => void;
};

export function OAuthSignInPanel({ title, body, onDevBypass }: Props) {
  const { authMode } = useAuth();
  const [busy, setBusy] = useState(false);
  const configured = hasSupabaseConfig();

  const onOAuth = useCallback(async (provider: Provider) => {
    setBusy(true);
    try {
      const err = await signInWithOAuthProvider(provider);
      if (err) {
        Alert.alert('Sign in failed', err);
      }
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      {configured ? (
        <>
          <Pressable
            style={[styles.primary, busy && styles.disabled]}
            disabled={busy}
            onPress={() => onOAuth('google')}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryLabel}>Continue with Google</Text>
            )}
          </Pressable>

          {Platform.OS === 'ios' ? (
            <Pressable
              style={[styles.secondary, busy && styles.disabled]}
              disabled={busy}
              onPress={() => onOAuth('apple')}
            >
              <Text style={styles.secondaryLabel}>Continue with Apple</Text>
            </Pressable>
          ) : null}

          <Text style={styles.emailHint}>Email — magic link / OTP can be added with `signInWithOtp` (see RECIPES.md).</Text>
        </>
      ) : (
        <Text style={styles.warn}>
          Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`, or use the dev bypass below.
        </Text>
      )}

      {__DEV__ && authMode === 'required' && onDevBypass ? (
        <Pressable style={styles.dev} onPress={onDevBypass}>
          <Text style={styles.devLabel}>Continue (dev bypass)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 22, opacity: 0.9 },
  warn: { fontSize: 15, lineHeight: 21, opacity: 0.85, color: '#b45309' },
  primary: {
    marginTop: 8,
    alignSelf: 'stretch',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryLabel: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondary: {
    alignSelf: 'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryLabel: { fontWeight: '600', fontSize: 16 },
  emailHint: { fontSize: 14, lineHeight: 20, opacity: 0.65 },
  disabled: { opacity: 0.6 },
  dev: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  devLabel: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
