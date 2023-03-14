import {
  InfiniteData,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '/navigators/types';

export function useMyChatListQuery() {
  return useInfiniteQuery({
    queryKey: ['chatList'],
    queryFn: ({ pageParam = 0 }) =>
      getMyChatList({
        offset: pageParam,
      }),
    retry: 1,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅 목록을 가져오는데 실패하였습니다: ${error.message}`);
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
    onSuccess(data) {
      console.log('채팅 목록을 가져왔습니다: ', data.pages, data.pageParams);
    },
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

export function useChatRoomMessagesQuery(chatRoomId: string | undefined) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId],

    queryFn: ({ pageParam = 0 }) => getChatMessages(chatRoomId, pageParam),
    retry: 1,
    onError: (error: AxiosError) => {
      Alert.alert(
        `채팅 메시지를 가져오는데 실패하였습니다: ${error.code}, ${error.message}`,
      );
    },
    onSuccess(data) {
      console.log('채팅 메시지를 가져왔습니다: ', data);

      queryClient.setQueryData(
        ['chatList'],
        (oldData: InfiniteData<ChatRoomListResponse> | undefined) => {
          if (oldData === undefined) {
            return undefined;
          }
          const newData = oldData.pages.map(page => {
            const newPage = page.items.map(item => {
              if (item.id === chatRoomId) {
                return {
                  ...item,
                  unreadCount: null,
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
            pageParams: oldData.pageParams,
          };
        },
      );
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

export function useDirectChatRoomQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['directChatRoom', userId],
    queryFn: () => getDirectChatRoom(userId),
    retry: 0,
    onError: (error: AxiosError) => {
      console.log('개인 채팅방 정보를 가져오는데 실패하였습니다: ', error);
    },
    onSuccess(data) {
      console.log('개인 채팅방 정보: ', data);
    },
    suspense: true,
    enabled: !!userId,
  });
}

export function useChatRoomMutation() {
  const queryClient = useQueryClient();
  const nav = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();

  return useMutation({
    mutationFn: postChatRoom,
    onError: (error: AxiosError) => {
      Alert.alert(`채팅방 생성에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      console.log('채팅방을 생성했습니다: ', data);
      if (data.isGroupChat) {
      } else {
        const myId = getValueFor('userId');
        const recieverId = data.members.find(m => m.user.id !== myId)?.id;
        queryClient.setQueryData(['directChatRoom', recieverId], data);
        nav.setParams({
          chatRoomId: data?.id,
          chatRoomMembers: data?.members,
          chatRoomDescription: data?.description,
          isGroupChat: data?.isGroupChat,
        });
      }
      // TODO: 채팅방 목록에 새로운 채팅방 추가 잘 되는지 확인, 안되면 수정
      queryClient.setQueryData(
        ['chatList'],
        (oldData: InfiniteData<ChatRoomListResponse> | undefined) => {
          if (oldData === undefined) {
            return undefined;
          }
          const newPage0 = {
            ...oldData.pages[0],
            items: [data, ...oldData.pages[0].items],
            total: oldData.pages[0].total + 1,
          };
          return {
            ...oldData,
            pages: [newPage0, ...oldData.pages.slice(1)],
          };
        },
      );
    },
  });
}
