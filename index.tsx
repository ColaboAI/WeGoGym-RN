/**
 * @format
 */

import * as React from 'react';
import { AppRegistry, useColorScheme } from 'react-native';
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
import 'react-native-gesture-handler';

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

export default function Main() {
  const isDarkMode = useColorScheme() === 'dark';
  let theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    // Add Store Provider here
    <SafeAreaProvider>
      <PaperProvider
        settings={{
          icon: props => <Ionicons {...props} />,
        }}
        theme={theme}>
        <NavigationContainer theme={theme}>
          <App />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
