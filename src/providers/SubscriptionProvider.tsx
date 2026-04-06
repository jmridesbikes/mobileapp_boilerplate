import React, { createContext, useContext } from 'react';

import { env } from '@/src/config/env';
import { RevenueCatIdentityBridge } from '@/src/integrations/revenuecat/RevenueCatIdentityBridge';
import {
  RevenueCatSubscriptionProvider,
  useRevenueCatSubscriptionContext,
} from '@/src/integrations/revenuecat/RevenueCatSubscriptionProvider';
import { NoopSubscriptionProvider, useNoopSubscriptionContext } from '@/src/providers/NoopSubscriptionProvider';
import type { SubscriptionState } from '@/src/providers/subscriptionTypes';

const SubscriptionContext = createContext<SubscriptionState | null>(null);

function RevenueCatBridge({ children }: { children: React.ReactNode }) {
  const state = useRevenueCatSubscriptionContext();
  return <SubscriptionContext.Provider value={state}>{children}</SubscriptionContext.Provider>;
}

function NoopBridge({ children }: { children: React.ReactNode }) {
  const state = useNoopSubscriptionContext();
  return <SubscriptionContext.Provider value={state}>{children}</SubscriptionContext.Provider>;
}

/**
 * Switches between noop subscription (default) and optional RevenueCat based on env.
 */
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  if (env.subscriptionMode === 'revenuecat') {
    return (
      <RevenueCatSubscriptionProvider>
        <RevenueCatIdentityBridge />
        <RevenueCatBridge>{children}</RevenueCatBridge>
      </RevenueCatSubscriptionProvider>
    );
  }

  return (
    <NoopSubscriptionProvider>
      <NoopBridge>{children}</NoopBridge>
    </NoopSubscriptionProvider>
  );
}

export function useSubscriptionState(): SubscriptionState {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscriptionState must be used within SubscriptionProvider');
  }
  return ctx;
}
