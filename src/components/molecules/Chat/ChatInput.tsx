import React, { useRef } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { ChatParamList, ChatStackParamList } from '/navigators/types';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getValueFor } from '/store/secureStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '/api/client';

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
    isTyping,
    setIsTyping,
    chatRoomMutation,
  } = props;
  const theme = useTheme();
  const myId = getValueFor('userId');
  // const nav = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const webSocket = useRef<WebSocket | null>(null);

  const handleSubmit = async () => {
    if (chatRoomId) {
      if (inputText.length > 0) {
        // send message
        setInputText('');
        setIsTyping(false);
      }
    } else {
      // create direct chat room
      if (userId && myId) {
        try {
          const chatRoom = await chatRoomMutation.mutateAsync({
            createdBy: myId,
            membersUserIds: [userId],
            isPrivate: true,
            isGroupChat: false,
          });
          webSocket.current = new WebSocket(
            `ws://${BASE_URL}/ws/chat/${chatRoom.id}/${myId}}`,
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        // TODO: error handling
        console.log('No user id');
      }
    }
  };

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
