import React, { useCallback, useEffect, useRef } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { Alert, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { ChatParamList, ChatStackScreenProps } from '/navigators/types';
import {
  InfiniteData,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getValueFor } from '/store/secureStore';
import { WS_URL } from '/api/client';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import { convertObjectKeyToCamelCase } from '/utils/util';
import { useNavigation } from '@react-navigation/native';
export type ChatInputProps = ChatParamList & {
  inputText: string;
  setInputText: (text: string) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  chatRoomMutation: UseMutationResult<
    ChatRoom,
    AxiosError<unknown, any>,
    ChatRoomCreate,
    unknown
  >;
};

/*
 * TODO: Reconect websocket on error
 */
const ChatInput = (props: ChatInputProps) => {
  const {
    chatRoomId,
    userId,
    inputText,
    setInputText,
    setIsTyping,
    chatRoomMutation,
  } = props;
  const nav = useNavigation<ChatStackScreenProps<'ChatRoom'>['navigation']>();

  const theme = useTheme();
  const myId = getValueFor('userId');
  const queryClient = useQueryClient();
  const webSocket = useRef<WebSocket | null>(null);
  const { onShow } = useSnackBarActions();

  const onMessageHandler = useCallback(
    (e: WebSocketMessageEvent) => {
      const data = JSON.parse(e.data);
      const convertedData = convertObjectKeyToCamelCase<Message>(data);
      if (data.type === 'text_message') {
        const message: Message = {
          id: convertedData.id,
          text: convertedData.text,
          createdAt: new Date(convertedData.createdAt),
          chatRoomId: convertedData.chatRoomId,
          userId: convertedData.userId,
        };

        queryClient.setQueryData(
          ['chatList'],
          (old: InfiniteData<ChatRoomListResponse> | undefined) => {
            if (old === undefined) {
              return undefined;
            }
            const newData = old.pages.map(page => {
              const newPage = page.items.map(item => {
                if (item.id === chatRoomId) {
                  return {
                    ...item,
                    lastMessageText: message.text,
                    lastMessageCreatedAt: message.createdAt,
                  };
                }
                return item;
              });
              return {
                ...page,
                items: newPage,
              };
            });
            return {
              pages: newData,
              pageParams: old.pageParams,
            };
          },
        );

        queryClient.setQueryData(
          ['chatMessages', chatRoomId],
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
      }
    },
    [chatRoomId, queryClient],
  );
  const connectWebSocket = useCallback(() => {
    if (webSocket.current) {
      webSocket.current.close();
      webSocket.current = null;
    }
    if (chatRoomId && myId) {
      const chatURL = `${WS_URL}/ws/chat/${chatRoomId}/${myId}`;
      webSocket.current = new WebSocket(chatURL);
      webSocket.current.onopen = () => {
        onShow('채팅방에 입장했습니다.', 'success', false);
      };
      webSocket.current.onclose = e => {
        console.log(`${e.code}: ${e.reason}`);
        // reconnect websocket
      };

      webSocket.current.onmessage = onMessageHandler;

      webSocket.current.onerror = () => {
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      };
    }
  }, [chatRoomId, myId, onMessageHandler, onShow]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
        webSocket.current = null;
      }
    };
  }, [connectWebSocket]);

  const createDirectChatRoom = useCallback(async () => {
    if (userId && myId) {
      try {
        const res = await chatRoomMutation.mutateAsync({
          adminUserId: myId,
          membersUserIds: [myId, userId],
          isGroupChat: false,
          isPrivate: true,
        });
        nav.setParams({
          chatRoomId: res.id,
        });
      } catch (e) {
        onShow('채팅방 생성에 실패했습니다.', 'error');
      }
    }
  }, [chatRoomMutation, myId, nav, onShow, userId]);

  const handleSubmit = useCallback(async () => {
    if (chatRoomId !== undefined && myId) {
      if (inputText.length > 0) {
        // send message
        if (webSocket.current && webSocket.current.readyState === 1) {
          webSocket.current.send(
            JSON.stringify({
              type: 'text_message',
              text: inputText,
            }),
          );
          setInputText('');
          setIsTyping(false);
        } else {
          Alert.alert('채팅방과의 연결이 끊어졌습니다.', '다시 시도해주세요.');
        }
      }
    } else {
      // create direct chat room
      if (userId && myId) {
        await createDirectChatRoom();
      } else {
        // TODO: error handling
        nav.navigate('ChatList');
      }
    }
  }, [
    nav,
    chatRoomId,
    createDirectChatRoom,
    inputText,
    myId,
    setInputText,
    setIsTyping,
    userId,
  ]);

  return (
    <TextInput
      mode="outlined"
      // left={
      //   // TODO: add image picker
      //   <TextInput.Icon
      //     mode="contained"
      //     icon="camera"
      //     containerColor={theme.colors.secondaryContainer}
      //     iconColor={theme.colors.onSecondaryContainer}
      //     style={{}}
      //     onPress={() => console.log('Camera Pressed')}
      //   />
      // }
      right={
        <TextInput.Icon
          mode="contained"
          icon="arrow-up"
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.onPrimaryContainer}
          onPress={() => handleSubmit()}
          disabled={chatRoomMutation.isLoading}
        />
      }
      value={inputText}
      onChangeText={txt => setInputText(txt)}
      onTextInput={() => setIsTyping(true)}
      onEndEditing={() => setIsTyping(false)}
      style={styles.ChatInputBar}
      outlineStyle={styles.Outline}
      multiline={true}
    />
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  ChatInputBar: {
    maxHeight: 80,
  },
  Outline: {
    borderRadius: 25,
    top: Platform.OS === 'ios' ? 0 : 6,
  },
});
