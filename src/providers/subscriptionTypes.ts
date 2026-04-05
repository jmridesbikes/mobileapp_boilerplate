import type { CustomerInfo } from 'react-native-purchases';

export type SubscriptionMode = 'none' | 'revenuecat';

/**
 * Unified subscription gate state for the shell app. Replace `none` with your own adapter in product code if needed.
 */
export type SubscriptionState = {
  mode: SubscriptionMode;
  customerInfo: CustomerInfo | null;
  isReady: boolean;
  /** When `mode === 'none'`, always true. When RevenueCat, reflects active entitlement. */
  hasEntitlement: boolean;
  /** True in Expo Go when using RevenueCat — native IAP not available in the store client. */
  isExpoGo: boolean;
};
