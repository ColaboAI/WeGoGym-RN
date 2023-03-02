import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  HomeScreen,
  DetailsScreen,
  NotificationsScreen,
  PostingScreen,
  UserScreen,
} from '../screens';
import DetailsNavBarHeader from './NavBarHeader/DetailsNavBarHeader';
import { HomeStackParamList, CustomTabScreenProps } from './types';
import DefaultNavBarHeader from './NavBarHeader/DefaultNavBarHeader';
import MyWorkoutPromisesScreen from '/screens/Home/MyWorkoutPromises';
const Stack = createNativeStackNavigator<HomeStackParamList>();
type Props = CustomTabScreenProps<'홈'>;

function Home({ navigation, route }: Props) {
  const notificationTitle = '알림';
  const postingTitle = '게시글 작성';
  const myWorkoutPromisesTitle = '내가 쓴 글';
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) || 'Home';
    if (routeName !== 'Home') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
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
        name="MyWorkoutPromises"
        component={MyWorkoutPromisesScreen}
        options={{
          header: props => (
            <DefaultNavBarHeader title={myWorkoutPromisesTitle} {...props} />
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
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default Home;
