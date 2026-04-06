import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/src/components/Themed';
import { env } from '@/src/config/env';

export default function OnboardingStepTwo() {
  const router = useRouter();
  const primaryColor = useThemeColor({}, 'primary');

  const goToRevenueCatStep = () => {
    router.replace('/(onboarding)/revenuecat');
  };

  if (env.authMode === 'none') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You are almost there</Text>
        <Text style={styles.subtitle}>
          Tap below to continue to the subscription step, then into the app (or paywall if RevenueCat mode is enabled).
        </Text>
        <Pressable style={[styles.button, { backgroundColor: primaryColor }]} onPress={goToRevenueCatStep}>
          <Text lightColor="#fff" darkColor="#fff" style={styles.buttonLabel}>
            Get started
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are almost there</Text>
      <Text style={styles.subtitle}>
        Tap below to sign in with Google or Apple, then you&apos;ll continue to the subscription step before the main
        app.
      </Text>
      <Pressable
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={() => router.replace('/(onboarding)/sso')}
      >
        <Text lightColor="#fff" darkColor="#fff" style={styles.buttonLabel}>
          Get started
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, opacity: 0.85 },
  button: {
    marginTop: 24,
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonLabel: { fontWeight: '600', fontSize: 16 },
});
