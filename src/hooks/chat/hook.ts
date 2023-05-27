import { useState } from 'react';
import { useChatRoomMutation } from '../queries/chat.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useChatRoomState() {
  const chatRoomMutation = useChatRoomMutation();

  const [limit] = useState(20);
  const [offset] = useState(0);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const inset = useSafeAreaInsets();
  return {
    inset,
    limit,
    offset,
    inputText,
    setInputText,
    isTyping,
    setIsTyping,
    chatRoomMutation,
  };
}
