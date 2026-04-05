/**
 * Metro resolves this import to SettingsSubscriptionSection.native.tsx on native and
 * SettingsSubscriptionSection.web.tsx on web. This base file exists solely so TypeScript
 * can resolve the module; it is never executed at runtime.
 *
 * If you add a new platform, add a corresponding SettingsSubscriptionSection.<platform>.tsx.
 */
export { SettingsSubscriptionSection } from './SettingsSubscriptionSection.native';
