import * as React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
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
  useNavigationContainerRef,
} from '@react-navigation/native';

import customLightColors from 'theme/customLightColors.json';
import customDarkColors from 'theme/customDarkColors.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthProvider from 'hooks/context/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onMessageInBackground } from '/utils/notification';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import codePush from 'react-native-code-push';
import RNBootSplash from 'react-native-bootsplash';
import App from './App';
import { useRef } from 'react';
import analytics from '@react-native-firebase/analytics';

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
    card: myLightTheme.colors.background,
  },
};
const CombinedDarkTheme = {
  ...myDarkTheme,
  ...DarkTheme,
  colors: {
    ...myDarkTheme.colors,
    ...DarkTheme.colors,
    card: myDarkTheme.colors.background,
  },
};
const queryClient = new QueryClient();
messaging().setBackgroundMessageHandler(onMessageInBackground);
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

function Main() {
  const isDarkMode = useColorScheme() === 'dark';
  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef();
  let theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    // Add Store Provider here
    <GestureHandlerRootView style={style.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider
            settings={{
              icon: props => <Ionicons {...props} />,
            }}
            theme={theme}>
            <AuthProvider>
              <NavigationContainer
                ref={navigationRef}
                theme={theme}
                onReady={() => {
                  routeNameRef.current = navigationRef.getCurrentRoute()?.name;
                  RNBootSplash.hide({
                    fade: true,
                    duration: 500,
                  });
                }}
                onStateChange={async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRoute = navigationRef.getCurrentRoute();
                  const currentRouteName = `${
                    currentRoute?.name
                  }_${Object.values(currentRoute?.params || {}).join('/')}`;

                  if (currentRoute && previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                      screen_class: currentRoute.name,
                      screen_name: currentRouteName,
                    });
                  }

                  // Save the current route name for later comparision
                  routeNameRef.current = currentRouteName;
                }}>
                <App />
              </NavigationContainer>
            </AuthProvider>
          </PaperProvider>
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

export default codePush(Main);
