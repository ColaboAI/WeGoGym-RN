import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  PostListScreen,
  PostCreateScreen,
  PostDetailScreen,
  UserScreen,
  SettingScreen,
  ProfileEditScreen,
} from 'screens';
import CommunityHeader from './NavBarHeader/Community';
import { CommunityStackParamList, CustomTabScreenProps } from './types';
import { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
const Stack = createNativeStackNavigator<CommunityStackParamList>();
type Props = CustomTabScreenProps<'커뮤니티'>;

function Community({ navigation, route }: Props) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'PostDetail' ||
      routeName === 'PostCreate' ||
      routeName === 'PostEdit' ||
      routeName === 'User' ||
      routeName === 'Setting' ||
      routeName === 'ProfileEdit'
    ) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="PostList"
      screenOptions={{
        header: props => <CommunityHeader {...props} />,
      }}>
      <Stack.Screen
        name="PostList"
        component={PostListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostCreate" component={PostCreateScreen} />
      {/* <Stack.Screen name="PostEdit" component={PostEditScreen} /> */}
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}

export default Community;
