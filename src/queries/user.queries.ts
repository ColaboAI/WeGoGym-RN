import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyInfo, postLogin, postRegister } from '@api/api';
import { Alert } from 'react-native';

export function useRegisterQuery() {
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

export function useLoginQuery() {
  const mutation = useMutation({
    mutationFn: postLogin,
    onError: (error: Error) => {
      Alert.alert(`로그인에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`로그인에 성공하였습니다!: ${data.token}`);
    },
  });
  return mutation;
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
