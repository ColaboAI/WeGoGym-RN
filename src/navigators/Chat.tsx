import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import { ChatListScreen, ChatRoomScreen } from 'screens';
import CustomNavBarHeader from './NavBarHeader/CustomNavBarHeader';
import { ChatStackParamList, CustomTabScreenProps } from './types';
const Stack = createNativeStackNavigator<ChatStackParamList>();
type Props = CustomTabScreenProps<'채팅'>;

function Chat({ navigation, route }: Props) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ChatRoom') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);
  // TODO: 채팅방 이름 헤더에 띄우기

  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        header: props => <CustomNavBarHeader {...props} />,
      }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
}

export default Chat;
