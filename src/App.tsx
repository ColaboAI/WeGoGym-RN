import React, { useEffect } from 'react';
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();
import { SplashScreen } from './screens';
import { useAuthValue, useAuthActions } from './hooks/context/useAuth';

function App() {
  const authState = useAuthValue();
  const authActions = useAuthActions();
  useEffect(() => {
    const bootstrapAsync = async () => {
      authActions.signIn(authState.userToken);
    };
    bootstrapAsync();
  }, [authActions, authState.userToken]);

  if (authState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
      {authState.userToken === null ? (
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
