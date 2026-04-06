import { useIsFocused } from '@react-navigation/native';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';
import { getPostOnboardingDestination } from '@/src/lib/postOnboardingDestination';
import { useAuth } from '@/src/providers/AuthProvider';
import { useSubscriptionState } from '@/src/providers/SubscriptionProvider';

/**
 * Root gate at `/`. Only runs navigation while this screen is focused, so subscription/auth state updates do not
 * repeatedly `replace('/(onboarding)')` and reset the stack back to step 1 while the user is on `/(onboarding)/sso`.
 */
export default function GateScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const isFocused = useIsFocused();
  const { completed, hydrated } = useOnboardingStatus();
  const { isReady: subReady, hasEntitlement, mode: subMode } = useSubscriptionState();
  const { isReady: authReady, isAuthenticated, authMode } = useAuth();

  useEffect(() => {
    if (!isFocused || !hydrated || !subReady || !authReady) return;

    const atRootGate = pathname === '/' || pathname === '' || pathname === '/index';
    if (!atRootGate) return;

    if (!completed) {
      router.replace('/(onboarding)');
      return;
    }

    const dest = getPostOnboardingDestination(authMode, isAuthenticated, subMode, hasEntitlement);
    router.replace(dest);
  }, [
    isFocused,
    hydrated,
    subReady,
    authReady,
    completed,
    authMode,
    isAuthenticated,
    subMode,
    hasEntitlement,
    router,
    pathname,
  ]);

  if (!hydrated || !subReady || !authReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
