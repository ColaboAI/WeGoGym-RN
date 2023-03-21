import { InputAccessoryView, StyleSheet, View, Platform } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Bubble from '/components/molecules/Chat/Bubble';
import InputToolbar from '/components/organisms/Chat/InputToolbar';
import { FlatList } from 'react-native-gesture-handler';
import { useChatRoomMessagesQuery } from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useChatRoomState } from '/hooks/chat/hook';

type ChatRoomScreenProps = ChatStackScreenProps<'ChatRoom'>;

function ChatRoom({ route }: ChatRoomScreenProps) {
  const {
    inset,
    inputText,
    setInputText,
    isTyping,
    setIsTyping,
    chatRoomMutation,
  } = useChatRoomState();

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
    useChatRoomMessagesQuery(route.params.chatRoomId);

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
          <FlatList
            contentContainerStyle={styles.contentContainer}
            data={data?.pages.flatMap(page => page.items)}
            keyExtractor={item => item.id}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.1}
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
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>메세지가 없습니다. 새로운 메세지를 작성해보세요!</Text>
              </View>
            }
          />
          {Platform.OS === 'ios' ? (
            <InputAccessoryView>
              <InputToolbar
                {...route.params}
                {...{
                  inputText,
                  setInputText,
                  isTyping,
                  setIsTyping,
                  chatRoomMutation,
                }}
              />
            </InputAccessoryView>
          ) : (
            <InputToolbar
              {...route.params}
              {...{
                inputText,
                setInputText,
                isTyping,
                setIsTyping,
                chatRoomMutation,
              }}
            />
          )}
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
    justifyContent: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatRoom;
