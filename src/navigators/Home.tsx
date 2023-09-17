import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  HomeScreen,
  DetailsScreen,
  NotificationsScreen,
  PostingScreen,
  UserScreen,
  SettingScreen,
  ProfileEditScreen,
  PostCreateScreen,
} from '../screens';
import DetailsNavBarHeader from './NavBarHeader/DetailsNavBarHeader';
import { HomeStackParamList, CustomTabScreenProps } from './types';
import DefaultNavBarHeader from './NavBarHeader/DefaultNavBarHeader';
import MyWorkoutPromisesScreen from '/screens/Home/MyWorkoutPromises';
import PromiseEditScreen from '/screens/Home/PromiseEdit';
import PostingNavBarHeader from './NavBarHeader/PostingNavBarHeader';
import CommunityHeader from './NavBarHeader/Community';

const Stack = createNativeStackNavigator<HomeStackParamList>();
type Props = CustomTabScreenProps<'홈'>;

function Home({ navigation, route }: Props) {
  const notificationTitle = '알림';
  const postingTitle = '운동 약속 만들기';
  const myWorkoutPromisesTitle = '나의 운동 약속';
  const promiseEditTitle = '운동 약속 수정하기';
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
        name="PromiseEdit"
        component={PromiseEditScreen}
        options={{
          header: props => (
            <DefaultNavBarHeader title={promiseEditTitle} {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="Posting"
        component={PostingScreen}
        options={{
          header: props => (
            <PostingNavBarHeader title={postingTitle} {...props} />
          ),
        }}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{
          header: props => <CommunityHeader {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

export default Home;
