import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, List, Text, useTheme } from 'react-native-paper';
import ChatListAvatar from '/components/molecules/Chat/ChatListAvatar';
import { useAuthValue } from '/hooks/context/useAuth';
import { ChatParamList } from '/navigators/types';
import { getRelativeTime } from '/utils/util';

type Props = {
  id: string;
  name?: string;
  description?: string;
  createdAt: Date;
  lastMessageText: string;
  lastMessageCreatedAt: Date;
  members: ChatRoomMember[];
  unreadCount: number | null;
  onPress: (params: ChatParamList) => void;
};

const ChatListItem = ({
  id,
  name,
  description,
  lastMessageText,
  lastMessageCreatedAt,
  members,
  unreadCount,
  onPress,
}: Props) => {
  const theme = useTheme();
  const authState = useAuthValue();
  const chatMems = members.filter(mem => mem.user.id !== authState.userId);

  const title = name ? name : chatMems.map(mem => mem.user.username).join(', ');
  return (
    <List.Item
      title={title}
      description={lastMessageText ?? description}
      style={{
        backgroundColor: theme.colors.background,
      }}
      titleStyle={{
        color: theme.colors.onBackground,
        fontWeight: '600',
      }}
      left={() => {
        return (
          chatMems.length > 0 && (
            <ChatListAvatar members={chatMems.slice(0, 3)} />
          )
        );
      }}
      right={() => (
        <View style={styles.rightContainer}>
          <Text variant={'labelSmall'}>
            {lastMessageCreatedAt ? getRelativeTime(lastMessageCreatedAt) : ''}
          </Text>
          {unreadCount && <Badge>{unreadCount}</Badge>}
        </View>
      )}
      // TODO: Fix this typing error
      onPress={() =>
        onPress({
          chatRoomId: id,
          chatRoomName: title,
          chatRoomDescription: description,
          chatRoomMembers: members,
          chatRoomType: members.length > 2 ? 'group' : 'direct',
        } as ChatParamList)
      }
    />
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
