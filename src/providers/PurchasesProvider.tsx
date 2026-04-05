import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { CustomerInfo } from 'react-native-purchases';

import { ENTITLEMENT_ID } from '@/src/constants/subscription';
import {
  configurePurchases,
  fetchCustomerInfo,
  hasActiveEntitlement,
  subscribeCustomerInfo,
} from '@/src/lib/purchases';
import { isExpoGo } from '@/src/lib/runtimeEnv';

type PurchasesContextValue = {
  customerInfo: CustomerInfo | null;
  isReady: boolean;
  hasEntitlement: boolean;
  /** True in Expo Go — RevenueCat native modules are not loaded; IAP is unavailable. */
  isExpoGo: boolean;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
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
        console.warn('[PurchasesProvider] configure/getCustomerInfo failed', e);
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
    () => ({ customerInfo, isReady, hasEntitlement, isExpoGo: expoGo }),
    [customerInfo, isReady, hasEntitlement, expoGo]
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchasesState(): PurchasesContextValue {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error('usePurchasesState must be used within PurchasesProvider');
  }
  return ctx;
}
