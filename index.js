import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { name as appName } from './app.json';
import Main from './src/Main';

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

AppRegistry.registerComponent(appName, () => HeadlessCheck);
