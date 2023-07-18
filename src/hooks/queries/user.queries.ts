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

export function useRegisterMutation() {
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({ user, img }: { user: UserCreate; img: FormData }) =>
      postRegister(user, img),
    onError: (error: Error) => {
      onShow(`회원가입에 실패하였습니다: ${error.message}`, 'error');
    },
    onSuccess() {
      onShow('회원가입에 성공하였습니다!', 'success');
    },
  });
}

export function useGetUserInfoQuery(id: string) {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['getUserInfo', id],
    queryFn: () => getUserInfo(id),
    retry: 1,
    onError: async (error: AxiosError) => {
      if (error.status === 404) {
        onShow('존재하지 않는 유저입니다.', 'error');
      } else if (error.status === 500) {
        onShow('서버에 문제가 발생하였습니다.', 'error');
      } else if (error.status === 401) {
        onShow('로그인이 필요합니다.', 'error');
      } else {
        onShow('유저 정보를 가져오는데 실패하였습니다.', 'error');
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
