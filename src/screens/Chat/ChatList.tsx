import { StyleSheet, Alert } from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import ChatListItem from '../../components/organisms/Chat/ChatListItem';
import { ChatParamList, ChatStackScreenProps } from 'navigators/types';
import { useMyChatListQuery } from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Headline, Text } from 'react-native-paper';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
type ChatListScreenProps = ChatStackScreenProps<'ChatList'>;
function ChatList({ navigation }: ChatListScreenProps) {
  // TODO: ChatRoom ID를 parameter로.
  const navigateToChatRoom = useCallback(
    (param: ChatParamList) => {
      navigation.navigate('ChatRoom', param);
    },
    [navigation],
  );

  // TODO: useInfiniteQuery로 변경
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);

  const { data } = useMyChatListQuery(limit, offset);
  const { reset } = useQueryErrorResetBoundary();
  // get chat list from server with useQuery

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
        <ScrollView style={style.container}>
          {data &&
            data.items.length > 0 &&
            data.items.map(item => (
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
            ))}
        </ScrollView>
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {},
});
export default ChatList;
