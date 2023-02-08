import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  HomeScreen,
  DetailsScreen,
  NotificationsScreen,
  PostingScreen,
} from '../screens';
import DetailsNavBarHeader from './NavBarHeader/DetailsNavBarHeader';
import { HomeStackParamList, CustomTabScreenProps } from './types';
import DefaultNavBarHeader from './NavBarHeader/DefaultNavBarHeader';
const Stack = createNativeStackNavigator<HomeStackParamList>();
type Props = CustomTabScreenProps<'홈'>;

function Home({ navigation, route }: Props) {
  const notificationTitle = '알림';
  const postingTitle = '게시글 작성';
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
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          header: props => <DetailsNavBarHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          header: props => (
            <DefaultNavBarHeader title={notificationTitle} {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="Posting"
        component={PostingScreen}
        options={{
          header: props => (
            <DefaultNavBarHeader title={postingTitle} {...props} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default Home;
