import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  WelcomeScreen,
  LoginScreen,
  PhoneNumberScreen,
  UsernameScreen,
  GenderScreen,
  BodyInformationScreen,
  WorkoutTimeScreen,
  WorkoutTimeHowLongScreen,
  WorkoutPerWeekScreen,
  WorkoutLevelScreen,
  WorkoutGoalScreen,
} from '../screens';
import AuthNavBarHeader from './NavBarHeader/AuthNavBarHeader';
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
      <Stack.Screen
        name="PhoneNumber"
        component={PhoneNumberScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Nickname" component={UsernameScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="BodyInformation" component={BodyInformationScreen} />
      <Stack.Screen name="WorkoutTime" component={WorkoutTimeScreen} />
      <Stack.Screen
        name="WorkoutTimeHowLong"
        component={WorkoutTimeHowLongScreen}
      />
      <Stack.Screen name="WorkoutPerWeek" component={WorkoutPerWeekScreen} />
      <Stack.Screen name="WorkoutLevel" component={WorkoutLevelScreen} />
      <Stack.Screen name="WorkoutGoal" component={WorkoutGoalScreen} />
    </Stack.Navigator>
  );
}

export default Auth;
