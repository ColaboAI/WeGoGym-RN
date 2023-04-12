import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import analytics from '@react-native-firebase/analytics';
import { Alert, Platform } from 'react-native';
import { clear, getValueFor, save } from '/store/secureStore';
export const requestPermissionToAnalytics = async () => {
  const myId = getValueFor('userId');
  const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  if (result === RESULTS.DENIED) {
    // The permission has not been requested, so request it.
    const res = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (res === RESULTS.GRANTED) {
      // The permission has been granted.
      await analytics().setAnalyticsCollectionEnabled(true);
      await analytics().setUserId(myId);
    }
  } else if (result === RESULTS.GRANTED) {
    await analytics().setAnalyticsCollectionEnabled(true);
    await analytics().setUserId(myId);
  }

  if (Platform.OS === 'android') {
    const analyticsEnabled = getValueFor('analytics');

    if (analyticsEnabled) {
      return;
    }

    Alert.alert(
      'WeGoGym은 앱 성능 개선을 위해 이용자의 앱 사용 정보를 수집합니다.',
      '수집된 정보는 이용자의 개인정보가 아니며, 이용자의 개인정보를 포함하지 않습니다.',
      [
        {
          text: '거부',
          onPress: async () => {
            clear('analytics');
            await analytics().setAnalyticsCollectionEnabled(false);
          },
          style: 'cancel',
        },
        {
          text: '허용',
          onPress: async () => {
            save('analytics', 'true');
            await analytics().setAnalyticsCollectionEnabled(true);
            await analytics().setUserId(myId);
          },
          style: 'destructive',
        },
      ],
    );
  }
};
