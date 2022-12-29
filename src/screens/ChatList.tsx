import { View, StyleSheet } from 'react-native';
import React from 'react';
import ChatListItem from '../component/organisms/Chat/ChatListItem';

function ChatList() {
  return (
    <View style={style.container}>
      <ChatListItem
        name="김철수"
        lastMessage="Hi there!"
        profilePic="https://avatars.githubusercontent.com/u/69342392?v=4"
        unreadCount={11}
      />
      <ChatListItem
        name="강경원"
        lastMessage="안녕하세요"
        profilePic={null}
        unreadCount={0}
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
