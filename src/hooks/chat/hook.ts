import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatRoomMutation } from '../queries/chat.queries';

export function useChatRoomState() {
  const chatRoomMutation = useChatRoomMutation();

  const inset = useSafeAreaInsets();
  const [limit] = useState(20);
  const [offset] = useState(0);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

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
