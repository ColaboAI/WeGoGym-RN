import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { name as appName } from './app.json';
import Main from './src/Main';
import { onMessageInBackground } from '/utils/notification';
import messaging from '@react-native-firebase/messaging';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Main />;
}

messaging().setBackgroundMessageHandler(onMessageInBackground);
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   const { notification, pressAction } = detail;
//   if (
//     notification === undefined ||
//     pressAction === undefined ||
//     type === undefined ||
//     notification.id === undefined
//   ) {
//     return;
//   }
//   // Check if the user pressed the "Mark as read" action
//   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
//     // Decrement the count by 1
//     await notifee.decrementBadgeCount();

//     // Remove the notification
//     await notifee.cancelNotification(notification.id);
//   }
// });

AppRegistry.registerComponent(appName, () => HeadlessCheck);
