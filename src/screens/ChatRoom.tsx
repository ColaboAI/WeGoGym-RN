import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { ChatStackScreenProps } from 'navigators/types';
import Bubble from 'component/molecules/Chat/Bubble';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({}: ChatRoomScreenProps) {
  const theme = useTheme();
  return (
    <View style={style.container}>
      <Text style={{ color: theme.colors.onBackground }}>채팅방 디테일</Text>
      <Bubble
        _id="1"
        text="안녕하세요"
        createdAt={new Date()}
        user={{
          _id: '1',
          name: '김철수',
          profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
        }}
        isLeft={true}
      />
      <Bubble
        _id="1"
        text="안녕하세요"
        createdAt={new Date()}
        user={{
          _id: '1',
          name: '김철수',
          profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
        }}
        isLeft={false}
      />
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ChatRoom;
