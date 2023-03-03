import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserInfo,
  getRecommendedMates,
  postRegister,
  putMyInfo,
} from '@api/api';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import { clear } from '/store/secureStore';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: postRegister,
    onError: (error: Error) => {
      Alert.alert(`회원가입에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`회원가입에 성공하였습니다!: ${data.token}`);
    },
  });
}

export function useGetUserInfoQuery(id: string) {
  return useQuery({
    queryKey: ['getUserInfo', id],
    queryFn: () => getUserInfo(id),
    retry: 1,
    onError: async (error: AxiosError) => {
      Alert.alert(`유저 정보를 가져오는데 실패하였습니다: ${error.message}`);
      // TODO: Refactor this
      if (error.response?.status === 404 || error.response?.status === 500) {
        clear('token');
        clear('refreshToken');
        clear('phoneNumber');
      }

      console.log(error);
    },
    // Type myInfoRead
    suspense: true,
  });
}

export function usePutMyInfoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user, img }: { user: UserUpdate; img: FormData }) =>
      putMyInfo(user, img),
    onError: (error: Error) => {
      Alert.alert(`내 정보를 수정하는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    onSuccess(data) {
      Alert.alert('내 정보를 수정하는데 성공하였습니다!');
      console.log(data);
      // invalidate the query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['getUserInfo', 'me'] });
    },
  });
}

export function useGetRecommendedMatesQuery(limit: number = 3) {
  return useQuery({
    queryKey: ['getRecommendedMates', limit],
    queryFn: () => getRecommendedMates(limit),
    retry: 1,
    onError: async (error: AxiosError) => {
      Alert.alert(
        `매칭을 위한 정보를 가져오는데 실패하였습니다: ${error.message}`,
      );
    },
    onSuccess(data) {
      console.log(data);
    },
    suspense: true,
  });
}
