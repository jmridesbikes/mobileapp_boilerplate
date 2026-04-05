import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/src/components/Themed';

export default function OnboardingStepOne() {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Short intro screen for your product.</Text>
      <Link href="/(onboarding)/step-two" asChild>
        <Pressable style={StyleSheet.flatten([styles.button, { backgroundColor: primaryColor }])}>
          <Text lightColor="#fff" darkColor="#fff" style={styles.buttonLabel}>Next</Text>
        </Pressable>
      </Link>
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
