/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import MainNavigator from './navigators/Main';
import Auth from './navigators/Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function App() {
  const Stack = createNativeStackNavigator();
  const isLoggedIn = false;
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={() => ({ headerShown: false })}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={Auth} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default App;
