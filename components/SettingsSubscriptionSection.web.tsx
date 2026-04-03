import { StyleSheet, Text } from 'react-native';

export function SettingsSubscriptionSection() {
  return (
    <>
      <Text style={styles.section}>Subscription</Text>
      <Text style={styles.row}>Web preview — use a native build for RevenueCat and IAP.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 16, fontSize: 13, fontWeight: '700', opacity: 0.6, textTransform: 'uppercase' },
  row: { fontSize: 16, opacity: 0.85 },
});
