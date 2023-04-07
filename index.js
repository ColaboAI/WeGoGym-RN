import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Main from './src/Main';
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <Main />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
