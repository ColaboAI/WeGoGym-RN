import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { UserScreen, SettingScreen, ProfileEditScreen } from '../screens';
import DefaultNavBarHeader from './NavBarHeader/DefaultNavBarHeader';
import { UserStackParamList, CustomTabScreenProps } from './types';
const Stack = createNativeStackNavigator<UserStackParamList>();
type Props = CustomTabScreenProps<'마이'>;

function User({ navigation, route }: Props) {
  const settingTitle = '설정';
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName !== 'User' && routeName !== undefined) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{
        header: props => (
          <DefaultNavBarHeader title={settingTitle} {...props} />
        ),
      }}>
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default User;
