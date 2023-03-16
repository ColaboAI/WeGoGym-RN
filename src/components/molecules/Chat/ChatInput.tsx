import React, { useCallback, useEffect, useRef } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { ChatParamList } from '/navigators/types';
import {
  InfiniteData,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getValueFor } from '/store/secureStore';
import { WS_BASE_URL } from '/api/client';
import { camelCase } from 'camel-case';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
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

const ChatInput = (props: ChatInputProps) => {
  const {
    chatRoomId,
    userId,
    inputText,
    setInputText,
    setIsTyping,
    chatRoomMutation,
  } = props;
  const theme = useTheme();
  const myId = getValueFor('userId');
  // const nav = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const queryClient = useQueryClient();
  const webSocket = useRef<WebSocket | null>(null);
  const { onShow } = useSnackBarActions();
  // Init websocket
  useEffect(() => {
    if (chatRoomId && myId) {
      if (webSocket.current === null) {
        const chatURL = `${WS_BASE_URL}/ws/chat/${chatRoomId}/${myId}`;
        webSocket.current = new WebSocket(chatURL);
        webSocket.current.onopen = () => {
          onShow('채팅방에 입장 했습니다.', 'success');
        };
        webSocket.current.onclose = e => {
          console.log(e.code, e.reason);
        };

        webSocket.current.onmessage = e => {
          const data = JSON.parse(e.data);
          const convertedData = Object.keys(data).reduce((acc, key) => {
            return {
              ...acc,
              [camelCase(key)]: data[key],
            };
          }, {} as Message);
          if (data.type === 'text') {
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
        };

        webSocket.current.onerror = e => {
          onShow(`${e.message}`, 'error');
        };
      }
    }

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, [chatRoomId, myId, onShow, queryClient]);

  const handleSubmit = useCallback(async () => {
    if (chatRoomId && myId) {
      if (inputText.length > 0) {
        // send message
        if (webSocket.current) {
          webSocket.current.send(
            JSON.stringify({
              type: 'text',
              text: inputText,
            }),
          );
        }
        setInputText('');
        setIsTyping(false);
      }
    } else {
      // create direct chat room
      if (userId && myId) {
        try {
          const res = await chatRoomMutation.mutateAsync({
            createdBy: myId,
            membersUserIds: [userId],
            isPrivate: true,
            isGroupChat: false,
          });
          if (res.id) {
            if (webSocket.current && inputText.length > 0) {
              webSocket.current.send(
                JSON.stringify({
                  type: 'text',
                  text: inputText,
                }),
              );
              setInputText('');
              setIsTyping(false);
            }
          }
          onShow('채팅방이 생성되었습니다.', 'success');
        } catch (e) {
          console.error(e);
          onShow('채팅방 생성에 실패했습니다.', 'error');
        }
      } else {
        // TODO: error handling
        console.log('No user id');
      }
    }
  }, [
    chatRoomId,
    chatRoomMutation,
    inputText,
    myId,
    onShow,
    setInputText,
    setIsTyping,
    userId,
  ]);

  return (
    <TextInput
      mode="outlined"
      left={
        <TextInput.Icon
          mode="contained"
          icon="camera"
          containerColor={theme.colors.secondaryContainer}
          iconColor={theme.colors.onSecondaryContainer}
          style={{}}
          onPress={() => console.log('Camera Pressed')}
        />
      }
      right={
        <TextInput.Icon
          mode="contained"
          icon="arrow-up"
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.onPrimaryContainer}
          onPress={() => handleSubmit()}
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
