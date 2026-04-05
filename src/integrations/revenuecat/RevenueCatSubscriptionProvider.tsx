import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { CustomerInfo } from 'react-native-purchases';

import { ENTITLEMENT_ID } from '@/src/constants/subscription';
import {
  configurePurchases,
  fetchCustomerInfo,
  hasActiveEntitlement,
  subscribeCustomerInfo,
} from '@/src/integrations/revenuecat/purchases';
import { isExpoGo } from '@/src/lib/runtimeEnv';
import type { SubscriptionState } from '@/src/providers/subscriptionTypes';

const RevenueCatSubscriptionContext = createContext<SubscriptionState | null>(null);

/**
 * RevenueCat-backed subscription state. Mount only when `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`.
 */
export function RevenueCatSubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isReady, setIsReady] = useState(false);
  const expoGo = useMemo(() => isExpoGo(), []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsReady(true);
      return;
    }

    if (expoGo) {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const configured = await configurePurchases();
        if (!configured) {
          return;
        }
        const info = await fetchCustomerInfo();
        if (!cancelled) setCustomerInfo(info);
        unsubscribe = subscribeCustomerInfo((next) => {
          if (!cancelled) setCustomerInfo(next);
        });
      } catch (e) {
        console.warn('[RevenueCatSubscriptionProvider] configure/getCustomerInfo failed', e);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [expoGo]);

  const hasEntitlement = useMemo(() => {
    if (Platform.OS === 'web') {
      return true;
    }
    if (expoGo) {
      return true;
    }
    return hasActiveEntitlement(customerInfo, ENTITLEMENT_ID);
  }, [customerInfo, expoGo]);

  const value = useMemo(
    (): SubscriptionState => ({
      mode: 'revenuecat',
      customerInfo,
      isReady,
      hasEntitlement,
      isExpoGo: expoGo,
    }),
    [customerInfo, isReady, hasEntitlement, expoGo]
  );

  return (
    <RevenueCatSubscriptionContext.Provider value={value}>{children}</RevenueCatSubscriptionContext.Provider>
  );
}

export function useRevenueCatSubscriptionContext(): SubscriptionState {
  const ctx = useContext(RevenueCatSubscriptionContext);
  if (!ctx) {
    throw new Error('useRevenueCatSubscriptionContext must be used within RevenueCatSubscriptionProvider');
  }
  return ctx;
}
