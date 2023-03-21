import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { putMyFCMToken } from '/api/api';
import { onMessageReceived } from '/utils/notification';

async function onAppBootstrap() {
  // Get the token
  const token = await messaging().getToken();

  // Save the token
  await putMyFCMToken(token);
  console.log('FCM Token: ', token);
}

export function useNotification() {
  useEffect(() => {
    onAppBootstrap();
  }, []);
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
}
