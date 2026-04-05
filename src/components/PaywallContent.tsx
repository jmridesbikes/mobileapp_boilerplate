/**
 * Metro resolves this import to PaywallContent.native.tsx on native and
 * PaywallContent.web.tsx on web. This base file exists solely so TypeScript
 * can resolve the module; it is never executed at runtime.
 *
 * If you add a new platform, add a corresponding PaywallContent.<platform>.tsx.
 */
export { PaywallContent } from './PaywallContent.native';
