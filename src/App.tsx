import React from 'react';
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();
import { SplashScreen } from './screens';
import { useAuthValue } from './hooks/context/useAuth';

function App() {
  const authState = useAuthValue();

  if (authState.isLoading) {
    return <SplashScreen />;
  }

  return (
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
  );
}

export default App;
