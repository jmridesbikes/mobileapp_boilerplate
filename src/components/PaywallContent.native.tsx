import { useRouter } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { StyleSheet, View } from 'react-native';

/**
 * RevenueCat dashboard paywall (templates / Paywalls v2). Requires a development build.
 */
export function PaywallContent() {
  const router = useRouter();

  return (
    <View style={styles.flex}>
      <RevenueCatUI.Paywall
        style={styles.flex}
        options={{
          displayCloseButton: true,
        }}
        onPurchaseCompleted={() => {
          router.replace('/');
        }}
        onRestoreCompleted={() => {
          router.replace('/');
        }}
        onDismiss={() => {
          router.replace('/');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
