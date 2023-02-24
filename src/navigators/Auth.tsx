import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  WelcomeScreen,
  LoginScreen,
  PhoneNumberLoginScreen,
  PhoneNumberRegisterScreen,
  UsernameScreen,
  GenderScreen,
  BodyInformationScreen,
  WorkoutTimePeriodScreen,
  WorkoutTimePerDayScreen,
  WorkoutPerWeekScreen,
  WorkoutLevelScreen,
  WorkoutGoalScreen,
} from '../screens';
import AuthNavBarHeader from './NavBarHeader/AuthNavBarHeader';
import { AuthStackParamList } from './types';
const Stack = createNativeStackNavigator<AuthStackParamList>();
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
      <Stack.Screen
        name="PhoneNumberRegister"
        component={PhoneNumberRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhoneNumberLogin"
        component={PhoneNumberLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Username" component={UsernameScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="BodyInformation" component={BodyInformationScreen} />
      <Stack.Screen
        name="WorkoutTimePeriod"
        component={WorkoutTimePeriodScreen}
      />
      <Stack.Screen
        name="WorkoutTimePerDay"
        component={WorkoutTimePerDayScreen}
      />
      <Stack.Screen name="WorkoutPerWeek" component={WorkoutPerWeekScreen} />
      <Stack.Screen name="WorkoutLevel" component={WorkoutLevelScreen} />
      <Stack.Screen name="WorkoutGoal" component={WorkoutGoalScreen} />
    </Stack.Navigator>
  );
}

export default Auth;
