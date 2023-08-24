import React, { useCallback, useEffect, useRef } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { ChatParamList, ChatStackScreenProps } from '/navigators/types';
import {
  InfiniteData,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { getValueFor } from '/store/secureStore';
import { WS_URL } from '/api/client';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import { convertObjectKeyToCamelCase } from '/utils/util';
import { useNavigation } from '@react-navigation/native';
import { AnimatedStyleProp } from 'react-native-reanimated';
export type ChatInputProps = ChatParamList & {
  inputText: string;
  setInputText: (text: string) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  chatRoomMutation: UseMutationResult<
    ChatRoom,
    CustomError,
    ChatRoomCreate,
    unknown
  >;
  animatedStyle: AnimatedStyleProp<ViewStyle>;
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
  const connectWebSocket = useCallback(async () => {
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
        return res.id;
      } catch (e) {
        onShow('채팅방 생성에 실패했습니다.', 'error');
      }
    }
  }, [chatRoomMutation, myId, onShow, userId]);

  const sendWebsocketMessage = useCallback(async () => {
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
      connectWebSocket();
      setTimeout(async () => {
        await sendWebsocketMessage();
      }, 100);
    }
  }, [connectWebSocket, inputText, setInputText, setIsTyping]);

  const handleSubmit = useCallback(async () => {
    if (chatRoomId !== undefined && myId) {
      if (inputText.length > 0) {
        await sendWebsocketMessage();
      }
    } else {
      // create direct chat room
      if (userId && myId) {
        const chatId = await createDirectChatRoom();
        if (chatId) {
          if (inputText.length > 0) {
            connectWebSocket();
            await sendWebsocketMessage();
          }
        }
      } else {
        // TODO: error handling
        nav.navigate('ChatList');
      }
    }
  }, [
    chatRoomId,
    myId,
    inputText.length,
    sendWebsocketMessage,
    userId,
    createDirectChatRoom,
    connectWebSocket,
    nav,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
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
              style={styles.sendBtnIcon}
              mode="contained"
              icon="arrow-up"
              containerColor={theme.colors.primaryContainer}
              color={theme.colors.onPrimaryContainer}
              onPress={() => handleSubmit()}
              disabled={chatRoomMutation.isLoading}
            />
          }
          value={inputText}
          onChangeText={txt => setInputText(txt)}
          onTextInput={() => setIsTyping(true)}
          onEndEditing={() => setIsTyping(false)}
          style={styles.chatInputBar}
          outlineStyle={styles.outline}
          multiline={true}
        />
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  chatInputBar: {
    maxHeight: 80,
    width: '100%',
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  outline: {
    borderRadius: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  sendBtnIcon: {
    top: Platform.OS === 'ios' ? 2 : 0,
  },
});
