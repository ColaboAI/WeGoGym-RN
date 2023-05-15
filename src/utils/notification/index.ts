import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { mmkv } from '/store/secureStore';
import { convertObjectKeyToCamelCase } from 'utils/util';

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

// TODO: MMKV에 current message 저장 후 => 앱이 실행되면 해당 메시지를 client에 최신화, MMKV에서 삭제
// TODO: 앱 실행 중인 경우 알람 보이지 않게?
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
    // TODO: increment badge count is not working
  }
  await notifee.incrementBadgeCount();
  await notifee.displayNotification({
    title: message.notification?.title || 'Wegogym',
    body: message.notification?.body || 'Wegogym',
    android: {
      channelId: channelId,
      pressAction: {
        id: 'mark-as-read',
        launchActivity: 'default',
      },
      sound: 'default',
    },
    ios: {
      categoryId: 'mark-as-read',
      sound: 'default',
    },
  });
}

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
      return;
    }
  }
  await notifee.incrementBadgeCount();
  await notifee.displayNotification({
    title: message.notification?.title || 'Wegogym',
    body: message.notification?.body || 'Wegogym',
    android: {
      channelId: channelId,
      pressAction: {
        id: 'mark-as-read',
        launchActivity: 'default',
      },
      sound: 'default',
      vibrationPattern: [300],
    },
    ios: {
      categoryId: 'mark-as-read',
      sound: 'default',
    },
  });
}

export {
  checkApplicationPermission,
  requestUserPermission,
  onMessageInBackground,
  onMessageInForeground,
};
