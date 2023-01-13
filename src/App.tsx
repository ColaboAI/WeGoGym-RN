/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { createContext, useEffect } from 'react';
import MainNavigator from './navigators/Main';
import Auth from './navigators/Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
// import { postUser } from './api/api';

const Stack = createNativeStackNavigator();
export const AuthContext = createContext({} as any);

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  }, []);

  // const authContext = React.useMemo(
  //   () => ({
  //     signIn: async data => {
  //       dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
  //     },
  //     signOut: async () => {
  //       await SecureStore.deleteItemAsync('userToken');
  //       dispatch({ type: 'SIGN_OUT' });
  //     },
  //     signUp: async data => {
  //       postUser(data).then(response => {
  //         if (response.onSuccess === 'success') {
  //           SecureStore.setItemAsync('userToken', response.token);
  //           dispatch({ type: 'SIGN_IN', token: response.token });
  //         } else {
  //           Alert.alert(response.error);
  //         }
  //       });
  //     },
  //   }),
  //   [],
  // );

  return (
    // <AuthContext.Provider value={authContext}>
    <Stack.Navigator screenOptions={() => ({ headerShown: false })}>
      {state.userToken == null ? (
        <>
          <Stack.Screen name="Auth" component={Auth} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        </>
      )}
    </Stack.Navigator>
    // </AuthContext.Provider>
  );
}

export default App;
