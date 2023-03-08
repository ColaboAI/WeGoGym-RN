import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getChatMessages,
  getChatRoom,
  getDirectChatRoom,
  getMyChatList,
  postChatRoom,
} from '@api/api';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import { getValueFor } from '/store/secureStore';

export function useMyChatListQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ['chatList', limit, offset],
    queryFn: () => getMyChatList({ limit, offset }),
    retry: 1,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅 목록을 가져오는데 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      console.log('채팅 목록을 가져왔습니다: ', data);
      console.log(
        '참여자  ',
        data.items.map(i => i.members),
      );
    },
    suspense: true,
  });
}

export function useChatRoomQuery(chatRoomId: string) {
  return useQuery({
    queryKey: ['chatRoom', chatRoomId],
    queryFn: () => getChatRoom(chatRoomId),
    retry: 1,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅방 정보를 가져오는데 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      console.log('채팅방 정보를 가져왔습니다: ', data);
    },
    suspense: true,
  });
}

export function useChatRoomMessagesQuery(
  chatRoomId: string | undefined,
  limit: number,
  offset: number,
) {
  return useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId, limit, offset],

    queryFn: props =>
      getChatMessages(chatRoomId, limit, props.pageParam || offset),
    retry: 1,
    onError: (error: AxiosError) => {
      Alert.alert(
        `채팅 메시지를 가져오는데 실패하였습니다: ${error.code}, ${error.message}`,
      );
    },
    onSuccess(data) {
      console.log('채팅 메시지를 가져왔습니다: ', data);
    },
    suspense: true,
    getNextPageParam: (lastPage, _) => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: (firstPage, _) => {
      if (firstPage.nextCursor === undefined) {
        return undefined;
      }
      return firstPage.nextCursor;
    },
    enabled: !!chatRoomId,
  });
}

export function useDirectChatRoomQuery(userId: string) {
  return useQuery({
    queryKey: ['directChatRoom', userId],
    queryFn: () => getDirectChatRoom(userId),
    retry: 0,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅방 정보를 가져오는데 실패하였습니다: ${error.message}`);
      if (error.response?.status === 404) {
        console.log('채팅방이 없습니다.');
      }
    },
    onSuccess(data) {
      console.log('채팅방 정보를 가져왔습니다: ', data);
    },
    suspense: true,
    enabled: !!userId,
  });
}

export function useChatRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postChatRoom,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅방 생성에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      console.log('채팅방을 생성했습니다: ', data);
      if (data.isGroupChat) {
        queryClient.setQueryData(['chatRoom', data.id], data);
      } else {
        const myId = getValueFor('userId');
        const recieverId = data.members.find(m => m.user.id !== myId)?.id;
        queryClient.setQueryData(['directChatRoom', recieverId], data);
      }
    },
  });
}
