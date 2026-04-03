import { Platform } from 'react-native';

export function SettingsSubscriptionSection() {
  if (Platform.OS === 'web') {
    const { SettingsSubscriptionSection: Web } = require('./SettingsSubscriptionSection.web');
    return <Web />;
  }
  const { SettingsSubscriptionSection: Native } = require('./SettingsSubscriptionSection.native');
  return <Native />;
}
