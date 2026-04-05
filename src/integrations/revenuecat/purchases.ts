import { Platform } from 'react-native';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import { env } from '@/src/config/env';
import { ENTITLEMENT_ID } from '@/src/constants/subscription';
import { isExpoGo } from '@/src/lib/runtimeEnv';

export { ENTITLEMENT_ID };

type PurchasesModule = typeof import('react-native-purchases');

function getPurchasesModule(): PurchasesModule | null {
  if (Platform.OS === 'web' || isExpoGo()) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('react-native-purchases') as PurchasesModule;
}

export function hasActiveEntitlement(
  customerInfo: CustomerInfo | null,
  entitlementId: string = ENTITLEMENT_ID
): boolean {
  if (!customerInfo) return false;
  return customerInfo.entitlements.active[entitlementId] != null;
}

export function getRevenueCatApiKey(): string | null {
  if (Platform.OS === 'web') return null;
  if (Platform.OS === 'ios') return env.revenueCatIosKey || null;
  return env.revenueCatAndroidKey || null;
}

/** Returns whether native Purchases SDK was configured (requires API keys in `.env`). */
export async function configurePurchases(): Promise<boolean> {
  if (Platform.OS === 'web' || isExpoGo()) return false;

  const mod = getPurchasesModule();
  if (!mod) return false;

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    console.warn(
      '[revenuecat] Set EXPO_PUBLIC_REVENUECAT_IOS_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_KEY for real IAP.'
    );
    return false;
  }

  const { default: Purchases, LOG_LEVEL } = mod;
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
  Purchases.configure({ apiKey });
  return true;
}

export async function getOfferings() {
  const mod = getPurchasesModule();
  if (!mod) throw new Error('Purchases SDK not available');
  return mod.default.getOfferings();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  const mod = getPurchasesModule();
  if (!mod) throw new Error('Purchases SDK not available');
  return mod.default.getCustomerInfo();
}

/** Initial fetch when SDK may be unavailable (returns null instead of throwing). */
export async function fetchCustomerInfo(): Promise<CustomerInfo | null> {
  const mod = getPurchasesModule();
  if (!mod) return null;
  try {
    return await mod.default.getCustomerInfo();
  } catch {
    return null;
  }
}

export async function restorePurchases(): Promise<CustomerInfo> {
  const mod = getPurchasesModule();
  if (!mod) throw new Error('Purchases SDK not available');
  return mod.default.restorePurchases();
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  const mod = getPurchasesModule();
  if (!mod) throw new Error('Purchases SDK not available');
  const { customerInfo } = await mod.default.purchasePackage(pkg);
  return customerInfo;
}

export type CustomerInfoListener = (info: CustomerInfo) => void;

/**
 * Registers RevenueCat customer-info listener. No-ops when Purchases is unavailable (web / Expo Go).
 */
export function subscribeCustomerInfo(listener: CustomerInfoListener): () => void {
  const mod = getPurchasesModule();
  if (!mod) return () => {};

  const { default: Purchases } = mod;
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}
