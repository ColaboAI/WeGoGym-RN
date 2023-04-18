import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import analytics from '@react-native-firebase/analytics';
import { getValueFor } from '/store/secureStore';
import { Platform } from 'react-native';
export const requestPermissionToAnalytics = async () => {
  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      // The permission has not been requested, so request it.
      const res = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (res === RESULTS.GRANTED) {
        // The permission has been granted.
        const myId = getValueFor('userId');
        await analytics().setAnalyticsCollectionEnabled(true);
        if (myId) {
          await analytics().setUserId(myId);
        }
      }
    } else if (result === RESULTS.GRANTED) {
      const myId = getValueFor('userId');
      await analytics().setAnalyticsCollectionEnabled(true);
      if (myId) {
        await analytics().setUserId(myId);
      }
    }
  } else if (Platform.OS === 'android') {
    const myId = getValueFor('userId');
    await analytics().setAnalyticsCollectionEnabled(true);
    if (myId) {
      await analytics().setUserId(myId);
    }
  }
};
