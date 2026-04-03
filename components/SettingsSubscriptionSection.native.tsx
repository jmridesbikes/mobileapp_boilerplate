import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

import { ENTITLEMENT_ID } from '@/src/constants/subscription';
import { useCustomerInfo } from '@/src/hooks/useCustomerInfo';
import { restorePurchases } from '@/src/lib/purchases';

function subscriptionManagementUrl(): string {
  if (Platform.OS === 'ios') {
    return 'https://apps.apple.com/account/subscriptions';
  }
  return 'https://play.google.com/store/account/subscriptions';
}

export function SettingsSubscriptionSection() {
  const router = useRouter();
  const { customerInfo, hasEntitlement } = useCustomerInfo();
  const [busy, setBusy] = useState(false);

  const entitlement = customerInfo?.entitlements.active[ENTITLEMENT_ID];
  const statusLabel = (() => {
    if (!customerInfo) return 'Not loaded';
    if (entitlement?.isActive) {
      if (entitlement.periodType === 'TRIAL') return 'Trial active';
      if (entitlement.periodType === 'INTRO') return 'Intro pricing';
      return 'Active';
    }
    return hasEntitlement ? 'Active' : 'Not subscribed';
  })();

  const onRestore = useCallback(async () => {
    setBusy(true);
    try {
      await restorePurchases();
      router.replace('/');
    } catch (e) {
      console.warn(e);
      Alert.alert('Restore failed', 'Could not restore purchases.');
    } finally {
      setBusy(false);
    }
  }, [router]);

  const onManageSubscriptions = useCallback(async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch {
      await WebBrowser.openBrowserAsync(subscriptionManagementUrl());
    }
  }, []);

  return (
    <>
      <Text style={styles.section}>Subscription</Text>
      <Text style={styles.row}>Status: {statusLabel}</Text>
      {entitlement?.expirationDate != null ? (
        <Text style={styles.rowMuted}>Renews / expires: {String(entitlement.expirationDate)}</Text>
      ) : null}

      <Pressable
        style={[styles.button, busy && styles.buttonDisabled]}
        onPress={onRestore}
        disabled={busy}
      >
        <Text style={styles.buttonLabel}>Restore purchases</Text>
      </Pressable>

      <Pressable style={styles.buttonSecondary} onPress={onManageSubscriptions}>
        <Text style={styles.buttonSecondaryLabel}>Manage subscription</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 16, fontSize: 13, fontWeight: '700', opacity: 0.6, textTransform: 'uppercase' },
  row: { fontSize: 16 },
  rowMuted: { fontSize: 14, opacity: 0.75 },
  button: {
    marginTop: 8,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonSecondary: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondaryLabel: { fontWeight: '600', fontSize: 16 },
});
