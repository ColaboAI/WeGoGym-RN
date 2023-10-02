import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { mmkv } from '/store/secureStore';
import { convertObjectKeyToCamelCase } from 'utils/util';
import { getLastestAppVersion } from '/api/api';
import { getVersion } from 'react-native-device-info';

async function checkApplicationPermission() {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }

  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('whenInUse');
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

async function saveMessageToMMKV(data: { [key: string]: string }) {
  if (data) {
    if (data.type === 'text_message') {
      const camelCasedData = convertObjectKeyToCamelCase<Message>(data);
      camelCasedData.createdAt = new Date(camelCasedData.createdAt);
      const currMsgListString = mmkv.getString('currentMessage');
      const currMsgList =
        currMsgListString !== undefined ? JSON.parse(currMsgListString) : [];
      const newMsgList = [...currMsgList, camelCasedData];
      mmkv.setItem('currentMessage', JSON.stringify(newMsgList));
    }
  }
}

async function onMessageInBackground(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  const channelId =
    (await notifee.getChannel('wegogym'))?.id ??
    (await notifee.createChannel({
      id: 'wegogym',
      name: 'Wegogym',
      importance: AndroidImportance.HIGH,
    }));
  const { data } = message;
  if (data) {
    if (data.type === 'text_message') {
      await saveMessageToMMKV(data);
    }
  }
  await notifee.displayNotification({
    title: message.notification?.title || data?.title || 'Wegogym',
    body: message.notification?.body || data?.body || 'Wegogym',
    android: {
      channelId: channelId,
      smallIcon: 'ic_small_icon',
      pressAction: {
        id: 'mark-as-read',
        launchActivity: 'default',
      },
      vibrationPattern: [100, 300],
      autoCancel: true,
      sound: 'default',
    },
    ios: {
      categoryId: 'mark-as-read',
      sound: 'default',
    },
  });
  await notifee.incrementBadgeCount();
}

// TODO: handle notification when app is in foreground (duplicate notification)
async function onMessageInForeground(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  const { data } = message;
  // except in chat room screen
  // check if current screen is chat room screen

  const channelId =
    (await notifee.getChannel('wegogym'))?.id ??
    (await notifee.createChannel({
      id: 'wegogym',
      name: 'Wegogym',
      importance: AndroidImportance.HIGH,
    }));

  if (data) {
    if (data.type === 'text_message') {
      if (data.chat_room_id === mmkv.getString('currentChatRoomId')) {
        return;
      }
      await saveMessageToMMKV(data);
    }
  }
  await notifee.displayNotification({
    title: message.notification?.title || data?.title || 'Wegogym',
    body: message.notification?.body || data?.body || 'Wegogym',
    android: {
      channelId: channelId,
      smallIcon: 'ic_small_icon',
      pressAction: {
        id: 'mark-as-read',
        launchActivity: 'default',
      },
      sound: 'default',
      vibrationPattern: [100, 300],
    },
    ios: {
      categoryId: 'mark-as-read',
      sound: 'default',
    },
  });
  await notifee.incrementBadgeCount();
}

async function checkIsLatestVersion() {
  const latestVersion = await getLastestAppVersion();
  const currentVersion = getVersion();
  if (latestVersion && latestVersion.versionNumber > currentVersion) {
    Alert.alert(
      '업데이트 필요',
      `새로운 버전(${latestVersion.versionNumber})이 있습니다. 업데이트하시겠습니까?`,
      [
        {
          text: '나중에',
          style: 'cancel',
        },
        {
          text: '업데이트',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL(latestVersion.updateLinkIOs);
              return;
            }
            Linking.openURL(latestVersion.updateLinkAndroid);
          },
        },
      ],
    );
  }
}

export {
  checkApplicationPermission,
  requestUserPermission,
  onMessageInBackground,
  onMessageInForeground,
  checkIsLatestVersion,
};
