import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getMyInfo,
  postLogin,
  postRegister,
  putMyInfo,
  refreshAccessToken,
} from '@api/api';
import { Alert } from 'react-native';
import { save } from '@store/secureStore';
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

export function useLoginMutation() {
  const q = useMutation({
    mutationFn: postLogin,
    onError: (error: Error) => {
      Alert.alert(`로그인에 실패하였습니다: ${error.message}`);
    },
    async onSuccess(data) {
      Alert.alert(`로그인에 성공하였습니다!: ${data.token}`);
      await save('token', data.token);
      await save('refreshToken', data.refreshToken);
    },
  });
  return q;
}

export function useGetMyInfoQuery() {
  return useQuery({
    queryKey: ['getMyInfo'],
    queryFn: getMyInfo,
    onError: (error: Error) => {
      Alert.alert(`내 정보를 가져오는데 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`내 정보를 가져오는데 성공하였습니다!: ${data}`);
    },
  });
}

export function usePutMyInfoMutation() {
  return useMutation({
    mutationFn: putMyInfo,
    onError: (error: Error) => {
      Alert.alert(`내 정보를 수정하는데 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`내 정보를 수정하는데 성공하였습니다!: ${data}`);
    },
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: refreshAccessToken,
    onError: (error: Error) => {
      Alert.alert(`토큰을 갱신하는데 실패하였습니다: ${error.message}`);
    },
    async onSuccess(data) {
      Alert.alert('토큰을 갱신하는데 성공하였습니다!');
      await save('token', data.token);
      await save('refreshToken', data.refreshToken);
    },
  });
}
