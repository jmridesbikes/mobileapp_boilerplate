import { useSubscriptionState } from '@/src/providers/SubscriptionProvider';

/** Thin alias for gate screens — `hasAccess` mirrors `hasEntitlement`. */
export function useSubscriptionAccess() {
  const s = useSubscriptionState();
  return {
    mode: s.mode,
    isReady: s.isReady,
    hasAccess: s.hasEntitlement,
    hasEntitlement: s.hasEntitlement,
    isExpoGo: s.isExpoGo,
  };
}
