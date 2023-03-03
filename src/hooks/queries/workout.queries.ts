import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getWorkoutPromise,
  getWorkoutPromiseById,
  postWorkoutPromise,
  postWorkoutParticipant,
  deleteWorkoutPromise,
} from '@api/api';
import { Alert } from 'react-native';

export function useWorkoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postWorkoutPromise,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 만들 수 없어요: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('운동 약속을 만들었어요!');
      // invalidate the query to refetch the data
      queryClient.invalidateQueries(['getWorkout']);
    },
  });
}

export function useWorkoutDeleteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkoutPromise,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 삭제할 수 없어요: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('운동 약속을 삭제했어요!');
      queryClient.invalidateQueries(['getWorkout']);
    },
  });
}

export function useWorkoutParticipantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postWorkoutParticipant,
    onError: (error: Error) => {
      Alert.alert(`운동 약속에 참가할 수 없어요: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('운동 약속에 참가 신청을 완료하였어요! 승인을 기다려주세요.');
      queryClient.invalidateQueries(['getWorkoutById', data.workoutPromiseId]);
    },
  });
}

export function useGetWorkoutQuery(limit: number, offset: number) {
  return useQuery({
    queryKey: ['getWorkout', limit, offset],
    queryFn: () => getWorkoutPromise({ limit, offset }),
    retry: 1,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 가져오는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    onSuccess(data) {
      console.log(data);
    },
    // Type myInfoRead
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetWorkoutByIdQuery(id: string) {
  return useQuery({
    queryKey: ['getWorkoutById', id],
    queryFn: () => getWorkoutPromiseById(id),
    retry: 1,
    onError: (error: Error) => {
      Alert.alert(
        `운동 약속 정보를 가져오는데 실패하였습니다: ${error.message}`,
      );
      console.log(error);
    },
    suspense: true,
  });
}
