import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import ChatListItem from '../../components/organisms/Chat/ChatListItem';
import { ChatStackScreenProps } from 'navigators/types';
type ChatListScreenProps = ChatStackScreenProps<'ChatList'>;
function ChatList({ navigation }: ChatListScreenProps) {
  // TODO: ChatRoom ID를 parameter로.
  const navigateToChatRoom = useCallback(() => {
    navigation.navigate('ChatRoom');
  }, [navigation]);

  return (
    <View style={style.container}>
      <ChatListItem
        name="김철수"
        lastMessage="Hi there!"
        profilePic="https://avatars.githubusercontent.com/u/69342392?v=4"
        unreadCount={11}
        onPress={navigateToChatRoom}
      />
      <ChatListItem
        name="강경원"
        lastMessage="안녕하세요"
        profilePic={null}
        unreadCount={0}
        onPress={navigateToChatRoom}
      />
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
export default ChatList;
