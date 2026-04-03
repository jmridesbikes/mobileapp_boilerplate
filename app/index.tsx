import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useCustomerInfo } from '@/src/hooks/useCustomerInfo';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';

export default function GateScreen() {
  const { completed, hydrated } = useOnboardingStatus();
  const { hasEntitlement, isReady } = useCustomerInfo();

  if (!hydrated || !isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!completed) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!hasEntitlement) {
    return <Redirect href="/(paywall)" />;
  }

  return <Redirect href="/(app)" />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
