import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';

import { env } from '@/src/config/env';
import { ENTITLEMENT_ID } from '@/src/constants/subscription';

export { ENTITLEMENT_ID };

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
  if (Platform.OS === 'web') return false;

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    console.warn(
      '[purchases] Set EXPO_PUBLIC_REVENUECAT_IOS_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_KEY for real IAP.'
    );
    return false;
  }

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
  Purchases.configure({ apiKey });
  return true;
}

export async function getOfferings() {
  return Purchases.getOfferings();
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}
