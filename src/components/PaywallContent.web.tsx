import { StyleSheet, Text, View } from 'react-native';

/** In-app purchases are not available in the browser; use Android/iOS dev client or EAS builds. */
export function PaywallContent() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Subscriptions</Text>
      <Text style={styles.body}>
        RevenueCat paywalls run in native builds. Use `npx expo run:android`, `npx expo run:ios`, or EAS — not Expo Go.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 22 },
});
