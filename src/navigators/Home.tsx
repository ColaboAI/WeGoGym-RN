import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HomeScreen, DetailsScreen, NotificationsScreen } from '../screens';
import HomeNavBarHeader from './NavBarHeader/HomeNavBarHeader';
import { HomeStackParamList, CustomTabScreenProps } from './types';
const Stack = createNativeStackNavigator<HomeStackParamList>();
type Props = CustomTabScreenProps<'홈'>;

function Home({ navigation, route }: Props) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);
    if (routeName !== 'Home' && routeName !== undefined) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: props => <HomeNavBarHeader title={'WeGoGym'} {...props} />,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default Home;
