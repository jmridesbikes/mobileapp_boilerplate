import React, { createContext, useContext, useMemo } from 'react';

import type { SubscriptionState } from '@/src/providers/subscriptionTypes';

const Ctx = createContext<SubscriptionState | null>(null);

/** Default: no paywall — subscription checks always pass. */
export function NoopSubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    (): SubscriptionState => ({
      mode: 'none',
      customerInfo: null,
      isReady: true,
      hasEntitlement: true,
      isExpoGo: false,
    }),
    []
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNoopSubscriptionContext(): SubscriptionState {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useNoopSubscriptionContext must be used within NoopSubscriptionProvider');
  }
  return ctx;
}
