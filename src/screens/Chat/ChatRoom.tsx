import { InputAccessoryView, StyleSheet, View, Platform } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Bubble from '/components/molecules/Chat/Bubble';
import InputToolbar from '/components/organisms/Chat/InputToolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import {
  useChatRoomMessagesQuery,
  useChatRoomMutation,
} from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;
// Logic for the chat room screen (chat room id is passed in the route params)
// 1. Get the chat room id from the route params
// 2. Get the messages for the chat room
// 3. Render the messages

// if chat room id is undefined, then we are creating a new chat room
// 1. Get the user id from the route params
// 2. Check if chat room exists with the user(receiver) and current user(sender)
// 3. Create a new chat room with the user
// 4. Navigate(replace) to the chat room screen with the new chat room id

function ChatRoom({ route }: ChatRoomScreenProps) {
  const inset = useSafeAreaInsets();
  const [limit] = React.useState(10);
  const [offset] = React.useState(0);

  const [roomId, setRoomId] = React.useState<string | undefined>(
    route.params.chatRoomId,
  );
  const getUserInfo = useCallback(
    (id: string) => {
      const found = route.params.chatRoomMembers?.find(
        member => member.user.id === id,
      )?.user;

      return found;
    },
    [route.params.chatRoomMembers],
  );

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useChatRoomMessagesQuery(roomId, limit, offset);
  // const messageMutation = useCreateMessageMutation();
  const chatRoomMutation = useChatRoomMutation();

  const { reset } = useQueryErrorResetBoundary();

  const renderItem = ({ item }: { item: Message }) => {
    return (
      <Bubble
        id={item.id}
        text={item.text}
        createdAt={item.createdAt}
        userId={item.userId}
        chatRoomId={item.chatRoomId}
        getUserInfo={getUserInfo}
      />
    );
  };

  return (
    <Suspense
      fallback={
        <View>
          <Text>Loading...</Text>
        </View>
      }>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Text>
            메세지를 불러올 수 없습니다.
            <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
          </Text>
        )}>
        <View
          style={[styles.ChatRoomContainer, { marginBottom: inset.bottom }]}>
          <>
            {((data?.pages.length === 1 && data.pages[0].total === 0) ||
              data?.pages === undefined) && (
              <View style={styles.emptyContainer}>
                <Text>메세지가 없습니다. 새로운 메세지를 작성해보세요!</Text>
              </View>
            )}

            <FlatList
              contentContainerStyle={styles.contentContainer}
              data={data?.pages.map(page => page.items).flat() || null}
              keyExtractor={item => item.id}
              onEndReached={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }

                console.log('onEndReached');
              }}
              onEndReachedThreshold={0.7}
              renderItem={renderItem}
              ListFooterComponent={
                <ActivityIndicator animating={isFetchingNextPage} />
              }
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
      </ErrorBoundary>
    </Suspense>
  );
}
const styles = StyleSheet.create({
  ChatRoomContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatRoom;
