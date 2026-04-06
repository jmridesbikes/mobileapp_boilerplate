# Recipes (optional product layers)

This repo stays **vendor-neutral** by default: no database client, no forced payments SDK. Use these recipes when you add a specific product on top.

## RevenueCat (in-app purchases)

1. Set in `.env`:
   - `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`
   - `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
2. Match `ENTITLEMENT_ID` in [`src/constants/subscription.ts`](src/constants/subscription.ts) to your RevenueCat dashboard entitlement.
3. Use a **native build** (`expo prebuild` + `expo run:*` or EAS), not Expo Go, for real IAP.

Integration code lives under [`src/integrations/revenuecat/`](src/integrations/revenuecat/).

### Supabase user id → RevenueCat

When both Supabase auth and RevenueCat are enabled, [`RevenueCatIdentityBridge`](src/integrations/revenuecat/RevenueCatIdentityBridge.tsx) calls `Purchases.logIn(supabaseUser.id)` after the SDK is ready and clears with `Purchases.logOut()` when the session ends. Use the Supabase **user UUID** (`auth.users.id` / JWT `sub`) as the RevenueCat **App User ID** so purchases and entitlements line up with Row Level Security.

## Auth (Supabase)

1. Set `EXPO_PUBLIC_AUTH_MODE=required` and add to `.env`:
   - `EXPO_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — anon / publishable key (safe in the client with RLS)
2. In the Supabase dashboard: **Authentication → Providers** — enable **Google** and/or **Apple** (and configure each provider’s client IDs / services as required).
3. **Authentication → URL configuration → Redirect URLs** — allow every URL your app uses to complete OAuth, including:
   - The URL from `Linking.createURL('auth/callback')` (depends on [`scheme`](app.config.js) and dev host). Add `mobileappboilerplate://**` or the exact redirect string if needed.
   - Expo dev / tunnel URLs (e.g. from `npx expo start --tunnel`) while testing.
4. [`app/(auth)/login.tsx`](app/(auth)/login.tsx) uses `signInWithOAuth` + `expo-web-browser` (PKCE). [`src/lib/supabase.ts`](src/lib/supabase.ts) persists the session with AsyncStorage.
5. **Email (magic link / OTP)** — add a separate flow with `signInWithOtp` and deep-link handling; not wired in the default login UI.

### Gate order (with auth + optional paywall)

[`app/index.tsx`](app/index.tsx) evaluates routes in this order: **onboarding** → **auth** (if required) → **paywall** (if RevenueCat and no entitlement) → **main app**. When a trial or subscription lapses, `CustomerInfo` updates and the same paywall gate applies again.

## Analytics / crash reporting

Add PostHog, Sentry, etc. as **optional** dependencies in your fork; keep them out of the base if you want a minimal clone.

## Backend webhooks (billing)

Host RevenueCat (or Stripe) webhooks on **your** server or Supabase Edge Functions — not inside this mobile repo.
