import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/src/providers/AuthProvider';
import { useSubscriptionState } from '@/src/providers/SubscriptionProvider';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';

export default function GateScreen() {
  const { completed, hydrated } = useOnboardingStatus();
  const { isReady: subReady, hasEntitlement, mode: subMode } = useSubscriptionState();
  const { isReady: authReady, isAuthenticated, authMode } = useAuth();

  if (!hydrated || !subReady || !authReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (authMode === 'required' && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!completed) {
    return <Redirect href="/(onboarding)" />;
  }

  if (subMode === 'revenuecat' && !hasEntitlement) {
    return <Redirect href="/(paywall)" />;
  }

  return <Redirect href="/(app)" />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
