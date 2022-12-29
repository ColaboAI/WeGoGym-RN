import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { UserScreen } from '../screens';
import CustomNavBarHeader from './CustomNavBarHeader';
const Stack = createNativeStackNavigator();
function User() {
  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{
        header: props => <CustomNavBarHeader title={'내 프로필'} {...props} />,
      }}>
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
}

export default User;
