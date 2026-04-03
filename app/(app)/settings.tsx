import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { SettingsSubscriptionSection } from '@/components/SettingsSubscriptionSection';
import { useOnboardingStatus } from '@/src/hooks/useOnboardingStatus';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStatus();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingsSubscriptionSection />

      <Text style={styles.section}>App</Text>
      <Text style={styles.rowMuted}>Version {Constants.expoConfig?.version ?? '—'}</Text>

      {__DEV__ ? (
        <>
          <Text style={styles.section}>Development</Text>
          <Pressable
            style={styles.buttonSecondary}
            onPress={async () => {
              await resetOnboarding();
              router.replace('/');
            }}
          >
            <Text style={styles.buttonSecondaryLabel}>Reset onboarding flag</Text>
          </Pressable>
        </>
      ) : null}

      <Pressable
        style={styles.link}
        onPress={() => Linking.openURL('https://example.com/terms')}
      >
        <Text style={styles.linkText}>Terms of service</Text>
      </Pressable>
      <Pressable
        style={styles.link}
        onPress={() => Linking.openURL('https://example.com/privacy')}
      >
        <Text style={styles.linkText}>Privacy policy</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 10, paddingBottom: 48 },
  section: { marginTop: 16, fontSize: 13, fontWeight: '700', opacity: 0.6, textTransform: 'uppercase' },
  rowMuted: { fontSize: 14, opacity: 0.75 },
  buttonSecondary: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondaryLabel: { fontWeight: '600', fontSize: 16 },
  link: { paddingVertical: 8 },
  linkText: { color: '#6366f1', fontSize: 16 },
});
