import * as React from 'react';
import { AppRegistry, StyleSheet, useColorScheme } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import customLightColors from './src/theme/customLightColors.json';
import customDarkColors from './src/theme/customDarkColors.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthProvider from 'hooks/context/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onMessageReceived } from '/utils/notification';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
// https://callstack.github.io/react-native-paper/theming.html

const myLightTheme = {
  ...MD3LightTheme,
  colors: customLightColors.colors,
};
const myDarkTheme = {
  ...MD3DarkTheme,
  colors: customDarkColors.colors,
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: myLightTheme,
  materialDark: myDarkTheme,
});

const CombinedDefaultTheme = {
  ...myLightTheme,
  ...LightTheme,
  colors: {
    ...myLightTheme.colors,
    ...LightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...myDarkTheme,
  ...DarkTheme,
  colors: {
    ...myDarkTheme.colors,
    ...DarkTheme.colors,
  },
};
const queryClient = new QueryClient();
messaging().setBackgroundMessageHandler(onMessageReceived);
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

export default function Main() {
  const isDarkMode = useColorScheme() === 'dark';
  let theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    // Add Store Provider here
    <GestureHandlerRootView style={style.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PaperProvider
              settings={{
                icon: props => <Ionicons {...props} />,
              }}
              theme={theme}>
              <NavigationContainer theme={theme}>
                <App />
              </NavigationContainer>
            </PaperProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function HeadlessCheck({ isHeadless }: { isHeadless: boolean }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <Main />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
