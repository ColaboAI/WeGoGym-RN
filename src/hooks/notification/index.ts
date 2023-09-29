import { useCallback, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { putMyFCMToken } from '/api/api';
import {
  checkApplicationPermission,
  checkIsLatestVersion,
  onMessageInForeground,
} from '/utils/notification';
import { getValueFor, save, secureMmkv } from '/store/secureStore';
import notifee from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '/navigators/types';
import { useQueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { requestPermissionToAnalytics } from '/utils/analytics';

export async function onAppBootstrap() {
  // Get the token
  const wggAccessToken = getValueFor('token');
  if (!wggAccessToken) {
    return;
  }
  const token = await messaging().getToken();
  try {
    await putMyFCMToken(token);
  } catch (e) {
    secureMmkv.deleteAllKeys();
  }
  // Check if the user has granted permission, if not, request it

  // Save the token to the server, and save it to the store
  save('fcmToken', token);
  // 어떤 Notification을 눌러서 앱이 실행되었는지 확인, 그에 따라 화면 이동
  await checkPermission();
}
async function checkPermission() {
  await checkApplicationPermission();
  await requestPermissionToAnalytics();
}

async function checkAppVersion() {
  await checkIsLatestVersion();
}

export function useNotification() {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const onInitialNotification = useCallback(async () => {
    // 앱이 Notification을 눌러서 실행된 경우
    // 해당 Notification의 data를 가져옴
    const initalNoti = await notifee.getInitialNotification();
    if (!initalNoti) {
      return;
    }
    const { notification, pressAction } = initalNoti;
    const { data } = notification;

    if (!data || !pressAction) {
      return;
    }
    if (data.type === 'text_message') {
      queryClient.invalidateQueries(['chatList'], {
        refetchPage: (page: ChatRoomListResponse) => {
          const isTargetPage = page.items.some(
            item => item.id === data.chat_room_id,
          );
          return isTargetPage;
        },
      });
      if (data.chat_room_id) {
        const chatRoomId = data.chat_room_id as string;
        navigation.navigate('MainNavigator', {
          screen: '덤벨챗',
          params: {
            screen: 'ChatRoom',
            params: { chatRoomId },
          },
        });
      }
    }
  }, [navigation, queryClient]);

  useEffect(() => {
    // appstate => focus
    // remove badge number & remove notification & invalidate chatList
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        const disNotifications = await notifee.getDisplayedNotifications();
        disNotifications.forEach(async dn => {
          const {
            notification: { data },
          } = dn;
          if (!data) {
            return;
          }
          if (data.type === 'text_message') {
            await queryClient.invalidateQueries(['chatList'], {
              refetchPage: (page: ChatRoomListResponse) => {
                const isTargetPage = page.items.some(
                  item => item.id === data.chat_room_id,
                );
                return isTargetPage;
              },
            });
          }
        });

        await notifee.cancelAllNotifications();
        await notifee.setBadgeCount(0);
      }
    };
    AppState.addEventListener('change', handleAppStateChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 앱이 foreground에서 실행되고 있을 때
    const unsub = messaging().onMessage(onMessageInForeground);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const unsub = messaging().onNotificationOpenedApp(onInitialNotification);
    return () => {
      unsub();
    };
  }, [onInitialNotification]);

  useEffect(() => {
    if (AppState.currentState === 'active') {
      checkPermission();
      checkAppVersion();
      return () => {};
    }

    const listener = AppState.addEventListener('change', status => {
      if (status === 'active') {
        checkPermission();
      }
    });
    return () => {
      listener.remove();
    };
  }, []);
}
