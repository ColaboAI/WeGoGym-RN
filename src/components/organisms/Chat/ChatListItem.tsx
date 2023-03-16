import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Badge, List, Text, useTheme } from 'react-native-paper';
import { deleteChatRoomMember } from '/api/api';
import ChatListAvatar from '/components/molecules/Chat/ChatListAvatar';
import { useAuthValue } from '/hooks/context/useAuth';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import { ChatParamList } from '/navigators/types';
import { getLocaleTime } from '/utils/util';

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
  const swipeRef = useRef<Swipeable>(null);
  const authState = useAuthValue();
  const chatMems = members.filter(mem => mem.user.id !== authState.userId);
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  const handleExitRoom = useCallback(async () => {
    // delete request to server (delete chatroommember)
    if (!authState.userId) {
      onShow('로그인이 필요합니다.');
      return;
    }

    const isDeleted = await deleteChatRoomMember(id, authState.userId);
    if (!isDeleted) {
      onShow('채팅방 나가기에 실패했습니다. 다시 시도해주세요.', 'error');
      return;
    } else {
      onShow('채팅방 나가기에 성공했습니다.', 'success');
      swipeRef.current?.close();
      queryClient.setQueryData(
        ['chatList'],
        (oldData: InfiniteData<ChatRoomListResponse> | undefined) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: oldData?.pages.map(page => {
              return {
                ...page,
                items: page.items.filter(chatRoom => chatRoom.id !== id),
                total: page.total - 1,
                nextCursor: page.nextCursor ? page.nextCursor - 1 : null,
              };
            }),
          };
        },
      );
    }
  }, [authState.userId, id, onShow, queryClient]);

  const title = name ? name : chatMems.map(mem => mem.user.username).join(', ');
  return (
    <>
      <Swipeable
        ref={swipeRef}
        renderRightActions={() => (
          <RectButton
            style={[
              { backgroundColor: theme.colors.tertiary },
              styles.swipeRight,
            ]}
            onPress={handleExitRoom}>
            <Animated.Text style={{ color: theme.colors.onTertiary }}>
              나가기
            </Animated.Text>
          </RectButton>
        )}>
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
                {lastMessageCreatedAt
                  ? getLocaleTime(lastMessageCreatedAt)
                  : ''}
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
      </Swipeable>
    </>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  swipeRight: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
