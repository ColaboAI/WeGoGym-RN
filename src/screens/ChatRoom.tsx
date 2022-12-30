import { StyleSheet } from 'react-native';
import React from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import Bubble from 'component/molecules/Chat/Bubble';
import ScreenWrapper from 'component/template/Common/ScreenWrapper';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({}: ChatRoomScreenProps) {
  return (
    <ScreenWrapper style={style.ChatRoomContainer}>
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
    </ScreenWrapper>
  );
}
const style = StyleSheet.create({
  ChatRoomContainer: {},
});
export default ChatRoom;
