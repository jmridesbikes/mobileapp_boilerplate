# Mobile app boilerplate (Expo, vendor-neutral core)

Expo Router (SDK 54) shell: TypeScript strict, composable **gate** at [`app/index.tsx`](app/index.tsx), onboarding, optional placeholder auth, optional RevenueCat paywall, and tabs (home + settings). **Defaults:** no login (`EXPO_PUBLIC_AUTH_MODE=none`) and **no** subscription gating (`EXPO_PUBLIC_SUBSCRIPTION_MODE=none`) so you can fork and add your product without ripping out a baked-in backend.

## Defaults vs optional modes

| Env | Meaning |
|-----|--------|
| `EXPO_PUBLIC_AUTH_MODE=none` (default) | Skip auth; gate goes onboarding → main app. |
| `EXPO_PUBLIC_AUTH_MODE=required` | Redirect to [`app/(auth)/login`](app/(auth)/login.tsx) until you wire a real provider (dev bypass available in `__DEV__`). |
| `EXPO_PUBLIC_SUBSCRIPTION_MODE=none` (default) | No paywall; entitlement check always passes. |
| `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat` | Enable RevenueCat + paywall gate; set public API keys in `.env`. |

See [RECIPES.md](RECIPES.md) for RevenueCat, auth backends, and webhooks.

## Requirements

- [Node.js](https://nodejs.org/) **≥ 20.19.4** (see `engines` in `package.json`).

## Quick start

```bash
npm install
Copy-Item .env.example .env   # PowerShell; or: cp .env.example .env
npm start
```

Useful scripts: `npm run typecheck`, `npm run lint`, `npm run prebuild`, `npm run run:android` / `npm run run:ios`.

## Flow

Root [`app/index.tsx`](app/index.tsx): **optional auth** → **onboarding** → **optional paywall** (RevenueCat only) → **main tabs**.

## RevenueCat / native IAP (optional)

If `EXPO_PUBLIC_SUBSCRIPTION_MODE=revenuecat`, use a **native build** (`prebuild` + `run:android` / `run:ios` or EAS) for real IAP — **not** Expo Go (see [RECIPES.md](RECIPES.md)).

| Environment | IAP when RevenueCat enabled |
|-------------|-----------------------------|
| **Expo Go** | Not supported; UI-only smoke tests. |
| **Dev / store build** | Install the build, run `npm start`, open the **installed** app. |

## New app checklist

1. **Identifiers** — In [app.config.js](app.config.js), set `name`, `slug`, `ios.bundleIdentifier`, `android.package`.
2. **Modes** — Set `EXPO_PUBLIC_AUTH_MODE` / `EXPO_PUBLIC_SUBSCRIPTION_MODE` in `.env` as needed.
3. **RevenueCat (if used)** — Entitlement id in [src/constants/subscription.ts](src/constants/subscription.ts); keys in `.env`; products in App Store Connect / Play Console.
4. **EAS** — `eas init`, then `eas build` (see [eas.json](eas.json)).
5. **Legal links** — Replace placeholder URLs in [app/(app)/settings.tsx](app/(app)/settings.tsx).

## Windows vs iOS

Daily development on Windows: Android emulator or device. For iOS store builds without a Mac, use **EAS Build** and TestFlight.
