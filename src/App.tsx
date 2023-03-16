import React, { useEffect } from 'react';
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();
import { SplashScreen } from './screens';
import { useAuthValue } from './hooks/context/useAuth';
import { useAxiosInterceptor } from './api/client';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SnackBarProvider from './hooks/context/SnackBarProvider';
function App() {
  const authState = useAuthValue();
  useEffect(() => {
    if (Platform.OS === 'ios') {
      enableScreens(false);
    }
  }, []);
  useAxiosInterceptor();

  if (authState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <SnackBarProvider>
      <QueryErrorResetBoundary>
        <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
          {/* TODO: Check phone number and Token */}
          {authState.token === null ? (
            <>
              <Stack.Screen name="Auth" component={Auth} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainNavigator" component={MainNavigator} />
            </>
          )}
        </Stack.Navigator>
      </QueryErrorResetBoundary>
    </SnackBarProvider>
  );
}

export default App;
