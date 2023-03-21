import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';

async function checkApplicationPermission() {
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
  const { data } = message;
  if (data === undefined) {
    return;
  }
  console.log('Message received: ', message);
  console.log('Data received: ', data);

  if (data.type === 'order_shipped') {
    notifee.displayNotification({
      title: 'Your order has been shipped',
      body: `Your order was shipped at ${new Date(
        Number(data.timestamp),
      ).toString()}!`,
      android: {
        channelId: 'orders',
      },
    });
  }
}

export { checkApplicationPermission, requestUserPermission, onMessageReceived };
