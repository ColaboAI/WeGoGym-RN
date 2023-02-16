import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, postRegister, putMyInfo } from '@api/api';
import { Alert } from 'react-native';
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

export function useGetMyInfoQuery() {
  return useQuery({
    queryKey: ['getMyInfo'],
    queryFn: getMyInfo,
    onError: (error: Error) => {
      Alert.alert(`내 정보를 가져오는데 실패하였습니다: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['getMyInfo'] });
    },
  });
}
