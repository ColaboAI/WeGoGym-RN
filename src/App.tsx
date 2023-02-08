/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { createContext, useEffect, useReducer } from 'react';
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();
import * as SecureStore from 'expo-secure-store';
import { SplashScreen } from './screens';
import AuthProvider from './hooks/context/AuthProvider';
import { useAuthValue, useAuthActions } from './hooks/context/useAuth';

function App() {
  const authState = useAuthValue();
  const authActions = useAuthActions();
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken = null;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.log(e);
      } finally {
        authActions.signIn(userToken);
      }
    };
    bootstrapAsync();
  }, []);

  if (authState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
        {authState.userToken == null ? (
          <>
            <Stack.Screen name="Auth" component={Auth} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainNavigator" component={MainNavigator} />
          </>
        )}
      </Stack.Navigator>
    </AuthProvider>
  );
}

export default App;
