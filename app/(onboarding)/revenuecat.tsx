import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View as RNView } from 'react-native';

import { Text, View, useThemeColor } from '@/src/components/Themed';
import { env } from '@/src/config/env';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';
import { getPostOnboardingDestination } from '@/src/lib/postOnboardingDestination';
import { useAuth } from '@/src/providers/AuthProvider';
import { useSubscriptionState } from '@/src/providers/SubscriptionProvider';

/**
 * Step 4 — placeholder for subscription / RevenueCat. Real purchases use the native SDK (`react-native-purchases`)
 * and the paywall route at `/(paywall)` when `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`, not a WebView iframe.
 *
 * After `completeOnboarding()`, navigate with `getPostOnboardingDestination` — not `router.replace('/')`, or the root
 * gate can read stale onboarding state and send users back to step 1.
 */
export default function OnboardingRevenueCatStep() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStatus();
  const { isAuthenticated, authMode } = useAuth();
  const { hasEntitlement, mode: subMode, isReady: subReady } = useSubscriptionState();
  const primaryColor = useThemeColor({}, 'primary');
  const muted = useThemeColor({ light: '#64748b', dark: '#94a3b8' }, 'text');

  const finishAndGoHome = async () => {
    await completeOnboarding();
    if (!subReady) {
      router.replace('/(app)');
      return;
    }
    const dest = getPostOnboardingDestination(authMode, isAuthenticated, subMode, hasEntitlement);
    router.replace(dest);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>
      <Text style={styles.subtitle}>
        This step reserves space for RevenueCat: offerings, packages, and purchase flows run through the native RevenueCat
        SDK in a dev or store build (see `/(paywall)` when subscription mode is enabled). There is no iframe — Apple and
        Google require in-app purchase UIs through their billing APIs.
      </Text>

      <RNView style={[styles.placeholder, { borderColor: muted }]}>
        <Text style={[styles.placeholderLabel, { color: muted }]}>
          RevenueCat UI placeholder — wire `PaywallContent`, custom paywall, or RevenueCat Paywalls here.
        </Text>
      </RNView>

      {env.subscriptionMode === 'revenuecat' ? (
        <Text style={[styles.hint, { color: muted }]}>
          With `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`, users without an entitlement are sent to the paywall after this
          step.
        </Text>
      ) : null}

      <Pressable
        style={[styles.primaryButton, { backgroundColor: primaryColor }]}
        onPress={() => void finishAndGoHome()}
      >
        <Text lightColor="#fff" darkColor="#fff" style={styles.primaryLabel}>
          Continue to app
        </Text>
      </Pressable>

      {__DEV__ ? (
        <Pressable style={styles.devButton} onPress={() => void finishAndGoHome()}>
          <Text style={styles.devLabel}>Continue (dev bypass — routing only)</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, lineHeight: 22, opacity: 0.9 },
  placeholder: {
    minHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    borderStyle: 'dashed',
    padding: 16,
    justifyContent: 'center',
  },
  placeholderLabel: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  hint: { fontSize: 13, lineHeight: 18 },
  primaryButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  primaryLabel: { fontWeight: '600', fontSize: 16 },
  devButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  devLabel: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
