import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { putMyFCMToken } from '/api/api';
import {
  checkApplicationPermission,
  onMessageReceived,
} from '/utils/notification';
import { save } from '/store/secureStore';
import notifee from '@notifee/react-native';
async function onAppBootstrap() {
  // Get the token
  const token = await messaging().getToken();

  // Check if the user has granted permission, if not, request it
  await checkApplicationPermission();

  // Save the token to the server, and save it to the store
  await putMyFCMToken(token);
  save('fcmToken', token);
}

export function useNotification() {
  useEffect(() => {
    onAppBootstrap();
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    notifee.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
    notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
    notifee.onForegroundEvent(({ detail }) => {
      const { notification } = detail;
      console.log('Notification received on Foreground', notification);
    });
    messaging().onMessage(onMessageReceived);
  }, []);
}
