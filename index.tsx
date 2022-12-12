/**
 * @format
 */

import * as React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};
export default function Main() {
  return (
    // Add Store Provider here
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);
