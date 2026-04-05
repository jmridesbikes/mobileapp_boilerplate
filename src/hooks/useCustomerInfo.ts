import { useSubscriptionState } from '@/src/providers/SubscriptionProvider';

/**
 * Subscription / entitlement state (RevenueCat when enabled, otherwise noop).
 * @deprecated Prefer `useSubscriptionState` for new code.
 */
export function useCustomerInfo() {
  const s = useSubscriptionState();
  return {
    customerInfo: s.customerInfo,
    isReady: s.isReady,
    hasEntitlement: s.hasEntitlement,
    isExpoGo: s.isExpoGo,
    mode: s.mode,
  };
}
