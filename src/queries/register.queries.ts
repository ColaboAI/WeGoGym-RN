import { useMutation } from '@tanstack/react-query';
import { postUser } from '@api/api';
import { Alert } from 'react-native';

export function useRegisterQuery() {
  const mutation = useMutation(postUser, {
    onError: (error: Error) => {
      Alert.alert(`회원가입에 실패하였습니다: ${error.message}`);
    },
    onSuccess(data) {
      Alert.alert(`회원가입에 성공하였습니다!: ${data.data.phone_number}`);
    },
  });
  return mutation;
}
