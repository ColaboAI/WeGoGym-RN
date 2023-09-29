import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { name as appName } from './app.json';
import Main from './src/Main';
import {
  onMessageInBackground,
  onMessageInForeground,
} from '/utils/notification';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

navigator.geolocation = require('react-native-geolocation-service');

messaging().setBackgroundMessageHandler(onMessageInBackground);
// 앱이 foreground에서 Notification을 받았을 때
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
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

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Main />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
