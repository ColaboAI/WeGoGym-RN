import { useQuery } from '@tanstack/react-query';
import { getMyChatList } from '@api/api';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';

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
