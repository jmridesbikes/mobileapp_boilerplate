import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { OAuthSignInPanel } from '@/src/components/auth/OAuthSignInPanel';
import { useAuth } from '@/src/providers/AuthProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { signInDevBypass, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <OAuthSignInPanel
        title="Sign in"
        body="Use Google or Apple (enable each provider in the Supabase dashboard). Add this app&apos;s redirect URL to Authentication → URL configuration. Email magic links can be added with `signInWithOtp` later."
        onDevBypass={() => {
          signInDevBypass();
          router.replace('/');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
