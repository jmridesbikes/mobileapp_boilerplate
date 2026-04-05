import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/**
 * `true` when running inside the Expo Go app (StoreClient). RevenueCat native modules are not available there.
 * Use a native build (`prebuild` + `expo run:*` or EAS) for real IAP.
 */
export function isExpoGo(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}
