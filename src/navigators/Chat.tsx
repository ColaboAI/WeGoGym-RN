import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChatListScreen, ChatRoomScreen } from 'screens';
import CustomNavBarHeader from './CustomNavBarHeader';
import { ChatStackParamList } from './types';
const Stack = createNativeStackNavigator<ChatStackParamList>();

function Chat() {
  const headerTitle = '채팅';
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        header: props => <CustomNavBarHeader title={headerTitle} {...props} />,
      }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
}

export default Chat;
