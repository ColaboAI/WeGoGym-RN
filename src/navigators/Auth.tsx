import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  WelcomeScreen,
  LoginScreen,
  PhoneNumberScreen,
  VerifyCodeScreen,
  NicknameScreen,
  BodyInformationScreen,
  WorkoutPerWeekScreen,
  WorkoutLevelScreen,
  WorkoutGoalScreen,
} from '../screens';
import AuthNavBarHeader from './AuthNavBarHeader';

const Stack = createNativeStackNavigator();
function Auth() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        header: props => <AuthNavBarHeader title="" {...props} />,
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
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="Nickname" component={NicknameScreen} />
      <Stack.Screen name="BodyInformation" component={BodyInformationScreen} />
      <Stack.Screen name="WorkoutPerWeek" component={WorkoutPerWeekScreen} />
      <Stack.Screen name="WorkoutLevel" component={WorkoutLevelScreen} />
      <Stack.Screen name="WorkoutGoal" component={WorkoutGoalScreen} />
    </Stack.Navigator>
  );
}

export default Auth;
