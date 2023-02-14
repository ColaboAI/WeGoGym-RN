import { useMutation, useQuery } from '@tanstack/react-query';
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
  const placeholderData: MyInfoRead = {
    id: '',
    username: '',
    phoneNumber: '',
    workoutLevel: '',
    workoutGoal: '',
    age: 0,
    height: 0,
    weight: 0,
    workoutPerWeek: 0,
    workoutTimePeriod: '',
    workoutTimePerDay: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
    gym: '',
    address: '',
    gender: '',
  };

  return useQuery({
    queryKey: ['getMyInfo'],
    queryFn: getMyInfo,
    onError: (error: Error) => {
      Alert.alert(`내 정보를 가져오는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    // Type myInfoRead
    placeholderData,
    suspense: true,
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
