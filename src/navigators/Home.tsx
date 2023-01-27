import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HomeScreen, DetailsScreen, NotificationsScreen } from '../screens';
import HomeNavBarHeader from './NavBarHeader/HomeNavBarHeader';
import { HomeStackParamList, CustomTabScreenProps } from './types';
const Stack = createNativeStackNavigator<HomeStackParamList>();
type Props = CustomTabScreenProps<'홈'>;

function Home({ navigation, route }: Props) {
  const title = '알림';
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Details') {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: props => <HomeNavBarHeader title={title} {...props} />,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default Home;
