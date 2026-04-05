# Recipes (optional product layers)

This repo stays **vendor-neutral** by default: no database client, no forced payments SDK. Use these recipes when you add a specific product on top.

## RevenueCat (in-app purchases)

1. Set in `.env`:
   - `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`
   - `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
2. Match `ENTITLEMENT_ID` in [`src/constants/subscription.ts`](src/constants/subscription.ts) to your RevenueCat dashboard entitlement.
3. Use a **native build** (`expo prebuild` + `expo run:*` or EAS), not Expo Go, for real IAP.

Integration code lives under [`src/integrations/revenuecat/`](src/integrations/revenuecat/).

## Auth (Supabase, Clerk, Firebase, …)

1. Set `EXPO_PUBLIC_AUTH_MODE=required` to surface [`app/(auth)/login.tsx`](app/(auth)/login.tsx).
2. Replace the placeholder screen and [`AuthProvider`](src/providers/AuthProvider.tsx) with your SDK:
   - Persist sessions with `expo-secure-store` (or similar).
   - Call `Purchases.logIn(userId)` after sign-in if you use RevenueCat.

## Analytics / crash reporting

Add PostHog, Sentry, etc. as **optional** dependencies in your fork; keep them out of the base if you want a minimal clone.

## Backend webhooks (billing)

Host RevenueCat (or Stripe) webhooks on **your** server or Supabase Edge Functions — not inside this mobile repo.
