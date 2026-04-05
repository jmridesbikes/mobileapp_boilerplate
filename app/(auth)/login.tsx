import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';

/**
 * Placeholder auth screen. Replace with Supabase, Clerk, Firebase, etc. (see RECIPES.md).
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signInDevBypass, authMode } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.body}>
        This boilerplate does not ship a real auth backend. Set `EXPO_PUBLIC_AUTH_MODE=required` only when you are ready to
        wire your provider, or keep `none` to skip login entirely.
      </Text>

      {__DEV__ && authMode === 'required' ? (
        <Pressable
          style={styles.primary}
          onPress={() => {
            signInDevBypass();
            router.replace('/');
          }}
        >
          <Text style={styles.primaryLabel}>Continue (dev bypass)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 22, opacity: 0.9 },
  primary: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryLabel: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
