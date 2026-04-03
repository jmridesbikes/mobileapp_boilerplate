import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';

export default function OnboardingStepTwo() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStatus();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>You are almost there</ThemedText>
      <ThemedText style={styles.subtitle}>Tap below to finish onboarding and continue to the paywall or app.</ThemedText>
      <Pressable
        style={styles.button}
        onPress={async () => {
          await completeOnboarding();
          router.replace('/');
        }}
      >
        <Text style={styles.buttonLabel}>Get started</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 16, opacity: 0.85 },
  button: {
    marginTop: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonLabel: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
