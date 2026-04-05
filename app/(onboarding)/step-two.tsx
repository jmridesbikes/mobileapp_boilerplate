import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/src/components/Themed';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';

export default function OnboardingStepTwo() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStatus();
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are almost there</Text>
      <Text style={styles.subtitle}>Tap below to finish onboarding. The root gate then sends you to the main app (or paywall if RevenueCat mode is enabled).</Text>
      <Pressable
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={async () => {
          await completeOnboarding();
          router.replace('/');
        }}
      >
        <Text lightColor="#fff" darkColor="#fff" style={styles.buttonLabel}>Get started</Text>
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
