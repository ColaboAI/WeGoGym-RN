import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import Bubble from 'component/molecules/Chat/Bubble';
import ScreenWrapper from 'component/template/Common/ScreenWrapper';
import InputToolbar from 'component/organisms/Chat/InputToolbar';
import TextInputAvoidingView from 'component/atoms/Common/TextInputAvoidingView';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({}: ChatRoomScreenProps) {
  // useLayoutEffect 사용해서 값 초기화
  // 채팅방 헤더
  return (
    <TextInputAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper
          style={style.ChatRoomContainer}
          keyboardDismissMode={'on-drag'}>
          <Bubble
            _id="1"
            text="안녕하세요"
            createdAt={new Date()}
            user={{
              _id: '1',
              name: '김철수',
              profilePic:
                'https://avatars.githubusercontent.com/u/69342392?v=4',
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
              profilePic:
                'https://avatars.githubusercontent.com/u/69342392?v=4',
            }}
            isLeft={false}
          />
        </ScreenWrapper>
      </TouchableWithoutFeedback>
      <InputToolbar />
    </TextInputAvoidingView>
  );
}
const style = StyleSheet.create({
  ChatRoomContainer: {
    flex: 1,
  },
});
export default ChatRoom;
