import { StyleSheet, Text, View } from 'react-native';

/** In-app purchases are not available in the browser; use a development build on a device or emulator. */
export function PaywallContent() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Subscriptions</Text>
      <Text style={styles.body}>
        RevenueCat runs in native builds. Use `npx expo run:android`, `npx expo run:ios`, or EAS. Expo Go can open this app
        for UI-only checks, but IAP requires a dev client build.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 22 },
});
