import { Platform } from 'react-native';

/**
 * Native uses RevenueCat paywall UI; web shows a short notice (IAP is not available in the browser).
 * Implemented with `require` so the native SDK is not pulled into the web bundle.
 */
export function PaywallContent() {
  if (Platform.OS === 'web') {
    const { PaywallContent: Web } = require('./PaywallContent.web');
    return <Web />;
  }
  const { PaywallContent: Native } = require('./PaywallContent.native');
  return <Native />;
}
