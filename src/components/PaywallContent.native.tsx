import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { env } from '@/src/config/env';
import { isExpoGo } from '@/src/lib/runtimeEnv';

/**
 * RevenueCat dashboard paywall when `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`. Requires a native dev/build (not Expo Go).
 */
export function PaywallContent() {
  const router = useRouter();

  if (env.subscriptionMode !== 'revenuecat') {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Subscriptions</Text>
        <Text style={styles.body}>
          Paywall is only used when `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`. The default base skips subscription gating.
        </Text>
        <Pressable onPress={() => router.replace('/')} style={styles.back}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (isExpoGo()) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Subscriptions</Text>
        <Text style={styles.body}>
          Expo Go does not include RevenueCat native modules. Install a native build (e.g. `npx expo run:android` or EAS), then run
          `npm start` and open the installed app.
        </Text>
        <Pressable onPress={() => router.replace('/')} style={styles.back}>
          <Text style={styles.backLabel}>Back to home</Text>
        </Pressable>
      </View>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native UI; not bundled in Expo Go paths
  const RevenueCatUI = require('react-native-purchases-ui').default;

  return (
    <View style={styles.flex}>
      <RevenueCatUI.Paywall
        style={styles.flex}
        options={{
          displayCloseButton: true,
        }}
        onPurchaseCompleted={() => {
          router.replace('/');
        }}
        onRestoreCompleted={() => {
          router.replace('/');
        }}
        onDismiss={() => {
          router.replace('/');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  box: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 22 },
  back: { marginTop: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: 16, color: '#6366f1', fontWeight: '600' },
});
