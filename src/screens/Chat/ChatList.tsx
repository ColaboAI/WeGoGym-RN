import { StyleSheet, Alert } from 'react-native';
import React, { Suspense, useCallback, useEffect } from 'react';
import ChatListItem from '../../components/organisms/Chat/ChatListItem';
import { ChatParamList, ChatStackScreenProps } from 'navigators/types';
import { useMyChatListQuery } from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Headline, Text } from 'react-native-paper';
import {
  InfiniteData,
  useQueryClient,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { FlatList } from 'react-native-gesture-handler';
import { useMMKVObject } from 'react-native-mmkv';
import { mmkv } from '/store/secureStore';

type ChatListScreenProps = ChatStackScreenProps<'ChatList'>;

function ChatList({ navigation }: ChatListScreenProps) {
  const navigateToChatRoom = useCallback(
    (param: ChatParamList) => {
      navigation.push('ChatRoom', param);
    },
    [navigation],
  );
  const queryClient = useQueryClient();
  const storage = mmkv.getStorage();

  const [currentMessage, setCurrentMessage] = useMMKVObject<Message[]>(
    'currentMessage',
    storage,
  );
  // TODO: Date 순서로 정렬? (최신순) 확인 필요.
  useEffect(() => {
    if (currentMessage && currentMessage.length > 0) {
      currentMessage.forEach(message => {
        queryClient.setQueryData(
          ['chatList'],
          (prev: InfiniteData<ChatRoomListResponse> | undefined) => {
            const found = prev?.pages
              .flatMap(page => page.items)
              .find(item => item.id === message.chatRoomId);
            if (found) {
              found.lastMessageText = message.text;
              found.lastMessageCreatedAt = message.createdAt;
              found.unreadCount = found.unreadCount ? found.unreadCount + 1 : 1;
            } else {
              queryClient.invalidateQueries(['chatList']);
            }
            return prev;
          },
        );
        queryClient.setQueryData(
          ['chatMessage', message.chatRoomId],
          (old: InfiniteData<MessageListResponse> | undefined) => {
            if (old) {
              const newMessagePage = {
                items: [message, ...old.pages[0].items],
                total: old.pages[0].total + 1,
                nextCursor: old.pages[0].nextCursor
                  ? old.pages[0].nextCursor + 1
                  : null,
              };

              const newMessageList = {
                ...old,
                pages: [newMessagePage, ...old.pages.slice(1)],
              };
              return newMessageList;
            } else {
              return {
                pages: [
                  {
                    items: [message],
                    total: 1,
                    nextCursor: 1,
                  },
                ],
                pageParams: [undefined],
              };
            }
          },
        );
      });
      setCurrentMessage([]);
    }
  }, [currentMessage, queryClient, setCurrentMessage]);

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
