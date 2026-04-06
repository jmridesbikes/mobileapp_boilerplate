/**
 * Public client config (EXPO_PUBLIC_*). No secrets — wire real backends in your product layer.
 */
const authRaw = process.env.EXPO_PUBLIC_AUTH_MODE ?? 'none';
const subRaw = process.env.EXPO_PUBLIC_SUBSCRIPTION_MODE ?? 'none';

export type AuthMode = 'none' | 'required';
export type SubscriptionMode = 'none' | 'revenuecat';

export const env = {
  authMode: (authRaw === 'required' ? 'required' : 'none') satisfies AuthMode,
  subscriptionMode: (subRaw === 'revenuecat' ? 'revenuecat' : 'none') satisfies SubscriptionMode,
  /** Supabase project URL — required for real auth when `authMode === 'required'`. */
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  /** Supabase anon (publishable) key — safe in the client with RLS. */
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** RevenueCat public SDK keys — only used when `subscriptionMode === 'revenuecat'`. */
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
};

export function hasSupabaseConfig(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
