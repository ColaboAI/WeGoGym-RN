import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { WelcomeScreen, LoginScreen, RegisterScreen } from '../screens';
import AuthNavBarHeader from './AuthNavBarHeader';

const Stack = createNativeStackNavigator();
function Auth() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        header: props => <AuthNavBarHeader title="WeGoGym" {...props} />,
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default Auth;
