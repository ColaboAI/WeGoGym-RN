import { Platform } from 'react-native';

export const defaultHapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export function useLightHapticType() {
  return Platform.select({ ios: 'impactLight', android: 'impackMedium' });
}
