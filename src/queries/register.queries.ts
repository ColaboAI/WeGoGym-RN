import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { UserCreate, UserRead } from '@type/types';
import { postUser } from '@api/api';
import { Alert } from 'react-native';

export function useRegisterQuery() {
  const mutation = useMutation<
    AxiosResponse<UserRead>,
    AxiosError,
    UserCreate,
    unknown
  >(postUser, {
    onError: (error: AxiosError) => {
      Alert.alert(`회원가입에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`회원가입에 성공하였습니다!: ${data.data.email}`);
    },
  });
  return mutation;
}
