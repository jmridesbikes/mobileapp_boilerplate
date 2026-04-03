import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { configurePurchases, hasActiveEntitlement } from '@/src/lib/purchases';
import { ENTITLEMENT_ID } from '@/src/constants/subscription';

type PurchasesContextValue = {
  customerInfo: CustomerInfo | null;
  isReady: boolean;
  hasEntitlement: boolean;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsReady(true);
      return;
    }

    let cancelled = false;
    let listenerAdded = false;
    const onCustomerInfoUpdate = (next: CustomerInfo) => {
      setCustomerInfo(next);
    };

    (async () => {
      try {
        const configured = await configurePurchases();
        if (!configured) {
          return;
        }
        const info = await Purchases.getCustomerInfo();
        if (!cancelled) setCustomerInfo(info);
        Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);
        listenerAdded = true;
      } catch (e) {
        console.warn('[PurchasesProvider] configure/getCustomerInfo failed', e);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
      if (listenerAdded) {
        Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
      }
    };
  }, []);

  const hasEntitlement = useMemo(() => {
    if (Platform.OS === 'web') {
      // Web: no Store / Play IAP — treat as entitled so you can exercise UI; use a dev build for real IAP.
      return true;
    }
    return hasActiveEntitlement(customerInfo, ENTITLEMENT_ID);
  }, [customerInfo]);

  const value = useMemo(
    () => ({ customerInfo, isReady, hasEntitlement }),
    [customerInfo, isReady, hasEntitlement]
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
