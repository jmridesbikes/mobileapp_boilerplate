import type { AuthMode, SubscriptionMode } from '@/src/config/env';

export type PostOnboardingHref = '/(auth)/login' | '/(paywall)' | '/(app)';

/**
 * Same routing rules as [`app/index.tsx`](app/index.tsx) after onboarding is marked complete — avoids navigating to `/`
 * (gate) which can read stale `completed` from AsyncStorage and send users back to step 1.
 */
export function getPostOnboardingDestination(
  authMode: AuthMode,
  isAuthenticated: boolean,
  subscriptionMode: SubscriptionMode,
  hasEntitlement: boolean
): PostOnboardingHref {
  if (authMode === 'required' && !isAuthenticated) {
    return '/(auth)/login';
  }
  if (subscriptionMode === 'revenuecat' && !hasEntitlement) {
    return '/(paywall)';
  }
  return '/(app)';
}
