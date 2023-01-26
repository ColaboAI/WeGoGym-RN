import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { UserScreen, SettingScreen } from '../screens';
import UserNavBarHeader from './UserNavBarHeader';

const Stack = createNativeStackNavigator();

function User({ navigation, route }: any) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName !== 'User' && routeName !== undefined) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: undefined } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{
        header: props => <UserNavBarHeader title="설정" {...props} />,
      }}>
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
}

export default User;
