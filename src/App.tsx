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
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
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
