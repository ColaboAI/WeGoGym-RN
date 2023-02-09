import React, { useEffect } from 'react';
import Auth from './navigators/Auth';
import MainNavigator from './navigators/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigators/types';
const Stack = createNativeStackNavigator<RootStackParamList>();
import { SplashScreen } from './screens';
import { useAuthValue, useAuthActions } from './hooks/context/useAuth';
import { getValueFor } from './store/secureStore';

function App() {
  const authState = useAuthValue();
  const authActions = useAuthActions();
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const isToken = await authActions.getTokenFromStorage();
        if (!isToken) {
          authActions.signIn(await getValueFor('phoneNumber'));
        }
      } catch (e) {
        console.log(e);
      }
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
