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

import codePush from 'react-native-code-push';
import RNBootSplash from 'react-native-bootsplash';
import App from './App';
import { useRef } from 'react';
import analytics from '@react-native-firebase/analytics';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 1000 * 60 * 5,
      suspense: true,
      useErrorBoundary: true,
    },
  },
});

function Main() {
  const isDarkMode = useColorScheme() === 'dark';
  const routeNameRef = useRef<string>();
  const navigationRef = useNavigationContainerRef();
  let theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    // Add Store Provider here
    <SafeAreaProvider>
      <GestureHandlerRootView style={style.container}>
        <KeyboardProvider>
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
                    routeNameRef.current =
                      navigationRef.getCurrentRoute()?.name;
                    RNBootSplash.hide({
                      fade: true,
                      duration: 500,
                    });
                  }}
                  onStateChange={async () => {
                    const previousRouteName = routeNameRef.current;
                    const currentRoute = navigationRef.getCurrentRoute();
                    const currentRouteName = `${Object.values(
                      currentRoute?.params ?? {},
                    ).join('/')}`;

                    if (
                      currentRoute &&
                      previousRouteName !== currentRouteName
                    ) {
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
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default codePush(Main);
