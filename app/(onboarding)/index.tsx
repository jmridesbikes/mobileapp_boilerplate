import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

export default function OnboardingStepOne() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome</ThemedText>
      <ThemedText style={styles.subtitle}>Short intro screen for your product.</ThemedText>
      <Link href="/(onboarding)/step-two" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonLabel}>Next</Text>
        </Pressable>
      </Link>
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
