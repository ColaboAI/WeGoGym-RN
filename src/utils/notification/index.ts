import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

async function checkApplicationPermission() {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }
}

async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  // const { data } = message;

  const channelId =
    (await notifee.getChannel('wegogym'))?.id ??
    (await notifee.createChannel({
      id: 'wegogym',
      name: 'Wegogym',
      importance: AndroidImportance.HIGH,
    }));

  await notifee.incrementBadgeCount();
  await notifee.displayNotification({
    title: message.notification?.title || 'Wegogym',
    body: message.notification?.body || 'Wegogym',
    android: {
      channelId: channelId,
    },
  });
}
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log('Notification received on Background', notification);
  if (
    notification === undefined ||
    pressAction === undefined ||
    type === undefined ||
    notification.id === undefined
  ) {
    return;
  }
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Decrement the count by 1
    await notifee.decrementBadgeCount();

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

export { checkApplicationPermission, requestUserPermission, onMessageReceived };
