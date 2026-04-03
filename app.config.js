// Load .env for local `expo start` / `eas build` (EXPO_PUBLIC_* inlined in JS; keys also read at runtime via process.env).
require('dotenv').config();

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'mobileapp_boilerplate',
  slug: 'mobileapp_boilerplate',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'mobileappboilerplate',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.mobileappboilerplate',
  },
  android: {
    package: 'com.yourcompany.mobileappboilerplate',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-dev-client'],
  experiments: {
    typedRoutes: true,
  },
};

module.exports = { expo: config };
