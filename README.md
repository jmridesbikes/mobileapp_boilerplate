# Mobile app boilerplate (Expo + RevenueCat)

Expo Router app with onboarding, a RevenueCat paywall (native UI), settings (restore, manage subscription, trials status), and entitlement gating. **Use a development build** (`expo-dev-client`) for in-app purchases — not Expo Go.

## Your next steps (recommended order)

1. **Tooling** — Install [Node.js](https://nodejs.org/) **≥ 20.19.4** (see `engines` in `package.json`). On Windows, use Android Studio’s emulator or a USB device for IAP; Xcode/iOS Simulator needs macOS.
2. **Install and env** — Run `npm install`, copy `.env.example` to `.env`, and paste your RevenueCat **public** API keys (Project settings → API keys).
3. **Rename the app** — In `app.config.js`, set `name`, `slug`, `ios.bundleIdentifier`, and `android.package` for your real product. Create matching iOS/Android apps in RevenueCat with the same bundle IDs.
4. **Stores + RevenueCat** — In App Store Connect and Play Console, create subscription products (with free trials / intro offers if you want). In RevenueCat, create an **entitlement** (e.g. `pro`), attach those products, and set `ENTITLEMENT_ID` in `src/constants/subscription.ts` to match. Optionally design a **Paywall** in the RevenueCat dashboard for `RevenueCatUI.Paywall`.
5. **Native project** — Run `npm run prebuild` once to generate `android/` / `ios/`, then `npm run run:android` on Windows. For iOS without a Mac, use **EAS Build** (after `eas login` and `eas init`).
6. **Dev client** — Start Metro with `npm run start:dev`, open the **development build** on the device/emulator (not Expo Go). Complete onboarding in the app; test purchase/restore in sandbox.

**Windows (PowerShell) copy env file:** `Copy-Item .env.example .env`

**Useful scripts:** `npm start` (Metro; choose dev client in the UI), `npm run start:dev` (expects a dev client), `npm run typecheck`, `npm run prebuild`, `npm run run:android` / `npm run run:ios`.

## Expo Go vs development build (RevenueCat)

| Environment | In-app purchases |
|-------------|-------------------|
| **Expo Go** (`npm run start:go`) | Not supported. RevenueCat uses native code that is not bundled inside the Expo Go app. The project loads in Expo Go for **UI-only** smoke tests; subscription buttons are stubbed. |
| **Development build** (`expo-dev-client`, e.g. `npm run run:android` or EAS `development` profile) | Supported. Install that build on a device/emulator, then run `npm run start:dev` and open the dev client (not Expo Go). |

Default script is **`npm start`** (`expo start`), which does **not** force Expo Go. Use **`npm run start:go`** only if you intentionally want the Expo Go app; expect limited functionality for this repo.

## Troubleshooting

- **“Cannot find native module” / crash on launch in Expo Go** — Expected if anything still imported `react-native-purchases` at the top level. This repo avoids that in Expo Go; use `npm start` or `npm run start:dev` with a **development build**. If you still use Expo Go, pull the latest changes and avoid `expo start --go` as the only workflow.
- **Paywall is empty or errors** — Ensure `.env` has valid RevenueCat public keys and store products are linked to your entitlement in the RevenueCat dashboard.
- **Stuck on paywall in a dev build** — Confirm sandbox testers / license testers and that the entitlement id matches `src/constants/subscription.ts`.

## Quick start

```bash
npm install
cp .env.example .env
# Fill EXPO_PUBLIC_REVENUECAT_IOS_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
npm run start:dev
```

After adding native modules, create native projects once:

```bash
npm run prebuild
npm run run:android
# iOS: macOS or EAS Build — see below
```

## New app checklist

1. **Identifiers** — In [app.config.js](app.config.js), set `ios.bundleIdentifier` and `android.package` (and the RevenueCat app entries) for your product.
2. **Entitlement** — In [src/constants/subscription.ts](src/constants/subscription.ts), set `ENTITLEMENT_ID` to match your RevenueCat dashboard entitlement (default: `pro`).
3. **Stores** — Create subscription products and free trials / intro offers in App Store Connect and Google Play Console; link them in RevenueCat and attach to the same entitlement.
4. **RevenueCat** — Create a project, add iOS/Android apps, paste **public** API keys into `.env` (see [.env.example](.env.example)). Configure a **Paywall** in the dashboard if you use `RevenueCatUI.Paywall`.
5. **EAS** — Run `eas init`, then `eas build --profile development` for a dev client, or `production` for store builds. iOS builds can run on EAS without a local Mac.
6. **Legal links** — Replace placeholder URLs in [app/(app)/settings.tsx](app/(app)/settings.tsx).

## Flow

On launch, `app/index.tsx` sends users to onboarding (first run), then the paywall if the entitlement is inactive, otherwise the main tabs (home + settings).

## Windows vs iOS

Daily development on Windows: Android emulator or device with a dev build. For iOS, use a Mac with Xcode or **EAS Build** and TestFlight.

## Node

This template targets a current Node LTS (see Expo’s requirements). Use Node **≥ 20.19.4** if you see engine warnings from the toolchain.
