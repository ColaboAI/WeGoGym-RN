import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { ChatStackScreenProps } from 'navigators/types';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Bubble from '/components/molecules/Chat/Bubble';
import InputToolbar from '/components/organisms/Chat/InputToolbar';
import {
  useChatRoomMessagesQuery,
  useChatRoomQuery,
} from '/hooks/queries/chat.queries';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useChatRoomState } from '/hooks/chat/hook';
import GymInfoLoader from '/components/molecules/Home/GymInfoLoader';
import { mmkv } from '/store/secureStore';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

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

  useEffect(() => {
    mmkv.setItem('currentChatRoomId', route.params.chatRoomId || '');
    return () => {
      mmkv.removeItem('currentChatRoomId');
    };
  }, [route.params.chatRoomId]);

  const getUserInfo = useCallback(
    (id: string) => {
      const found = route.params.chatRoomMembers?.find(
        member => member.user.id === id,
      )?.user;

      return found;
    },
    [route.params.chatRoomMembers],
  );

  useChatRoomQuery(route.params.chatRoomId);

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
  const { height } = useReanimatedKeyboardAnimation();
  const inputAccessoryStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: height.value === 0 ? inset.bottom : 5,
      transform: [{ translateY: height.value }],
    };
  });
  const contentContainerPadding = useMemo(() => {
    return {
      paddingTop: inset.bottom + 65,
    };
  }, [inset.bottom]);

  return (
    <Suspense fallback={<GymInfoLoader />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Text>
            메세지를 불러올 수 없습니다.
            <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
          </Text>
        )}>
        <View style={[styles.chatRoomContainer]}>
          <Animated.FlatList
            contentContainerStyle={[
              styles.contentContainer,
              contentContainerPadding,
            ]}
            style={styles.flatList}
            data={data?.pages.flatMap(page => page.items)}
            keyExtractor={item => item.id}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.2}
            renderItem={renderItem}
            ListFooterComponent={
              <ActivityIndicator animating={isFetchingNextPage} />
            }
            inverted={true}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustKeyboardInsets={true}
            contentInsetAdjustmentBehavior="never"
          />
          <InputToolbar
            {...route.params}
            {...{
              inputText,
              setInputText,
              isTyping,
              setIsTyping,
              chatRoomMutation,
              animatedStyle: inputAccessoryStyle,
            }}
          />
        </View>
      </ErrorBoundary>
    </Suspense>
  );
}
const styles = StyleSheet.create({
  chatRoomContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
});
export default ChatRoom;
