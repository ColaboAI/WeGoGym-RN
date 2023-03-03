import { InputAccessoryView, StyleSheet, View } from 'react-native';
import React from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import Bubble from '/components/molecules/Chat/Bubble';
import InputToolbar from '/components/organisms/Chat/InputToolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({ route }: ChatRoomScreenProps) {
  const inset = useSafeAreaInsets();

  // get chat room id from route params
  const { chatRoomId } = route.params;
  // const { data: messages } = useChatRoomMessagesQuery(chatRoomId);

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
          automaticallyAdjustContentInsets={false}
          inverted={true}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 80,
          }}
          automaticallyAdjustKeyboardInsets={true}
        />
        {Platform.OS === 'ios' ? (
          <InputAccessoryView>
            <InputToolbar />
          </InputAccessoryView>
        ) : (
          <InputToolbar />
        )}
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
