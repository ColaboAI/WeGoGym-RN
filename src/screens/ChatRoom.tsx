import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import Bubble from 'component/molecules/Chat/Bubble';
import InputToolbar from 'component/organisms/Chat/InputToolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({}: ChatRoomScreenProps) {
  // useLayoutEffect 사용해서 값 초기화
  // 채팅방 헤더
  const inset = useSafeAreaInsets();

  const messages = [
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: true,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: false,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: false,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: false,
    },
    {
      _id: '1',
      text: '안녕하세요',
      createdAt: new Date(),
      user: {
        _id: '1',
        name: '김철수',
        profilePic: 'https://avatars.githubusercontent.com/u/69342392?v=4',
      },
      isLeft: false,
    },
  ];

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Bubble
        _id={item._id}
        text={item.text}
        createdAt={item.createdAt}
        user={item.user}
        isLeft={item.isLeft}
      />
    );
  };

  return (
    <View style={[styles.ChatRoomContainer, { marginBottom: inset.bottom }]}>
      <>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={messages}
          renderItem={renderItem}
          keyboardDismissMode="interactive"
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 80,
          }}
          automaticallyAdjustKeyboardInsets={true}
        />
        <InputToolbar />
      </>
    </View>
  );
}
const styles = StyleSheet.create({
  ChatRoomContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
export default ChatRoom;
