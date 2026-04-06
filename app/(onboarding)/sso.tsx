import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { OAuthSignInPanel } from '@/src/components/auth/OAuthSignInPanel';
import { useAuth } from '@/src/providers/AuthProvider';

/**
 * SSO step (step 3). Next: `/(onboarding)/revenuecat` — onboarding completes only after that step.
 */
export default function OnboardingSsoScreen() {
  const router = useRouter();
  const { signInDevBypass, authMode, isAuthenticated } = useAuth();
  const didNavigateToRevenueCat = useRef(false);

  useEffect(() => {
    if (authMode === 'required' && isAuthenticated && !didNavigateToRevenueCat.current) {
      didNavigateToRevenueCat.current = true;
      router.replace('/(onboarding)/revenuecat');
    }
  }, [authMode, isAuthenticated, router]);

  useEffect(() => {
    if (authMode === 'none') {
      router.replace('/(onboarding)/step-two');
    }
  }, [authMode, router]);

  if (authMode === 'none') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <OAuthSignInPanel
      title="Sign in"
      body="Use Google or Apple. Enable providers and redirect URLs in the Supabase dashboard (see RECIPES.md). Next you’ll set up subscription (RevenueCat placeholder), then the main app."
      onDevBypass={() => {
        signInDevBypass();
        didNavigateToRevenueCat.current = true;
        router.replace('/(onboarding)/revenuecat');
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
