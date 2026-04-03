import { usePurchasesState } from '@/src/providers/PurchasesProvider';

/**
 * Subscribes to RevenueCat `CustomerInfo` via `PurchasesProvider` (listener + initial fetch).
 */
export function useCustomerInfo() {
  return usePurchasesState();
}
