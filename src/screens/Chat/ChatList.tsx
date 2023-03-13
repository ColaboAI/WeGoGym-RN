import { StyleSheet, Alert } from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import ChatListItem from '../../components/organisms/Chat/ChatListItem';
import { ChatParamList, ChatStackScreenProps } from 'navigators/types';
import { useMyChatListQuery } from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Headline, Text } from 'react-native-paper';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { FlatList } from 'react-native-gesture-handler';
type ChatListScreenProps = ChatStackScreenProps<'ChatList'>;
function ChatList({ navigation }: ChatListScreenProps) {
  const navigateToChatRoom = useCallback(
    (param: ChatParamList) => {
      navigation.push('ChatRoom', param);
    },
    [navigation],
  );

  // TODO: useInfiniteQuery로 변경

  const { data, hasNextPage, fetchNextPage } = useMyChatListQuery();
  const { reset } = useQueryErrorResetBoundary();
  // get chat list from server with useQuery

  const renderItem = useCallback(
    ({ item }: { item: ChatRoom }) => {
      return (
        <ChatListItem
          key={`chat-list-${item.id}`}
          id={item.id}
          name={item.name}
          description={item.description}
          createdAt={item.createdAt}
          lastMessageText={item.lastMessageText}
          lastMessageCreatedAt={item.lastMessageCreatedAt}
          members={item.members}
          unreadCount={item.unreadCount}
          onPress={navigateToChatRoom}
        />
      );
    },
    [navigateToChatRoom],
  );

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Headline>
            There was an error!
            <Button
              onPress={() => {
                resetErrorBoundary();
                Alert.alert("I'm error boundary");
              }}>
              Try again
            </Button>
          </Headline>
        )}>
        <FlatList
          style={style.container}
          contentContainerStyle={style.contentContainer}
          data={data?.pages.flatMap(page => page.items)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // TODO: onEndReadched Debugging , Debounce..
          // Threshold를 0.7로 설정하면, 스크롤이 끝에 도달했을 때, 70%의 높이를 넘어서야 onEndReached가 호출된다.?
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
            console.log('onEndReached');
          }}
          onEndReachedThreshold={0.7}
        />
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {},
  contentContainer: {
    flexGrow: 1,
  },
});
export default ChatList;
