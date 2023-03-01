import { View, StyleSheet } from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import ChatListItem from '../../components/organisms/Chat/ChatListItem';
import { ChatStackScreenProps } from 'navigators/types';
import { useMyChatListQuery } from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { Text } from 'react-native-paper';
type ChatListScreenProps = ChatStackScreenProps<'ChatList'>;
function ChatList({ navigation }: ChatListScreenProps) {
  // TODO: ChatRoom ID를 parameter로.
  const navigateToChatRoom = useCallback(() => {
    navigation.navigate('ChatRoom', {});
  }, [navigation]);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data } = useMyChatListQuery(limit, offset);

  // get chat list from server with useQuery

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary fallback={<Text>Loading</Text>}>
        <View style={style.container}>
          {data &&
            data.items.length > 0 &&
            data.items.map(item => (
              <ChatListItem
                key={item.id}
                name={item.name}
                description={item.description}
                createdAt={item.createdAt}
                lastMessageText={item.lastMessageText}
                lastMessageCreatedAt={item.lastMessageCreatedAt}
                members={item.members}
                onPress={navigateToChatRoom}
              />
            ))}
        </View>
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
export default ChatList;
