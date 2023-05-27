import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserInfo,
  getRecommendedMates,
  postRegister,
  putMyInfo,
  getMyBlockedList,
} from '@api/api';
import { AxiosError } from 'axios';
import { useSnackBarActions } from '../context/useSnackbar';
import { Alert } from 'react-native';
import { secureMmkv } from '/store/secureStore';

export function useRegisterMutation() {
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: postRegister,
    onError: (error: Error) => {
      onShow(`회원가입에 실패하였습니다: ${error.message}`, 'error');
    },
    onSuccess() {
      onShow('회원가입에 성공하였습니다!', 'success');
    },
  });
}

export function useGetUserInfoQuery(id: string) {
  return useQuery({
    queryKey: ['getUserInfo', id],
    queryFn: () => getUserInfo(id),
    retry: 0,
    onError: (error: AxiosError) => {
      if (error.response?.status === 404) {
        Alert.alert('존재하지 않는 사용자입니다.');
        if (id === 'me') {
          secureMmkv.deleteAllKeys();
        }
      } else if (error.response?.status === 403) {
        Alert.alert('비공개 계정입니다.');
      } else {
        Alert.alert('사용자 정보를 불러오는데 실패하였습니다.');
      }
    },
    // Type myInfoRead
    suspense: true,
  });
}

export function usePutMyInfoMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user, img }: { user: UserUpdate; img: FormData }) =>
      putMyInfo(user, img),
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        onShow(
          error.response?.data.message ?? '내 정보를 수정하는데 실패하였습니다',
          'error',
        );
      } else {
        onShow('내 정보를 수정하는데 실패하였습니다.', 'error');
      }
    },
    onSuccess() {
      onShow('내 정보를 수정하였습니다.', 'success');
      // invalidate the query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['getUserInfo', 'me'] });
    },
  });
}

export function useGetRecommendedMatesQuery(limit: number = 3) {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['getRecommendedMates', limit],
    queryFn: () => getRecommendedMates(limit),
    retry: 1,
    onError: async () => {
      onShow('매칭을 위한 정보를 가져오는데 실패하였습니다.', 'error');
    },
    suspense: true,
  });
}

export function useGetMyBlockedListQuery() {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['getMyBlockedList'],
    queryFn: getMyBlockedList,
    retry: 1,
    onError: async () => {
      onShow('차단한 유저 목록을 가져오는데 실패하였습니다.', 'error');
    },
  });
}
