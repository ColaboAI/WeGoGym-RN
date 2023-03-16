import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getWorkoutPromise,
  getWorkoutPromiseById,
  postWorkoutPromise,
  postWorkoutParticipant,
  deleteWorkoutPromise,
  deleteWorkoutParticipant,
  putWorkoutPromiseInfo,
  getWorkoutPromiseWrittenByUserId,
  getWorkoutPromiseJoinedByUserId,
  getRecruitingWorkoutPromise,
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
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
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
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
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
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
    },
  });
}

export function useWorkoutParticipantDeleteMutation(workoutPromiseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkoutParticipant,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 취소할 수 없어요: ${error.message}`);
    },
    onSuccess() {
      Alert.alert(
        '운동 약속 참가 취소 완료하였어요! 다른 운동 약속에 참가해보세요!',
      );
      queryClient.invalidateQueries(['getWorkoutById', workoutPromiseId]);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
      queryClient.invalidateQueries(['getWorkout']);
    },
  });
}

export function useGetWorkoutQuery() {
  return useInfiniteQuery({
    queryKey: ['getWorkout'],
    queryFn: ({ pageParam = 0 }) => getWorkoutPromise(pageParam),
    getNextPageParam: lastPage => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: firstPage => {
      if (firstPage.prevCursor === undefined) {
        return undefined;
      }
      return firstPage.prevCursor;
    },
    retry: 1,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 가져오는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    onSuccess(data) {
      console.log('운동 약속을 가져왔습니다 :', data);
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetRecruitingWorkoutQuery() {
  return useInfiniteQuery({
    queryKey: ['getRecruitingWorkout'],
    queryFn: ({ pageParam = 0 }) => getRecruitingWorkoutPromise(pageParam),
    retry: 1,
    getNextPageParam: lastPage => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: firstPage => {
      if (firstPage.prevCursor === undefined) {
        return undefined;
      }
      return firstPage.prevCursor;
    },
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 가져오는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    onSuccess(data) {
      console.log('운동 약속을 가져왔습니다.', data);
    },
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

export function useGetWorkoutWrittenByUserIdQuery(userId: string) {
  return useInfiniteQuery({
    queryKey: ['getWorkoutWrittenByUserId', userId],
    queryFn: ({ pageParam = 0 }) =>
      getWorkoutPromiseWrittenByUserId(pageParam, userId),
    retry: 1,
    getNextPageParam: lastPage => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: firstPage => {
      if (firstPage.prevCursor === undefined) {
        return undefined;
      }
      return firstPage.prevCursor;
    },
    onError: (error: Error) => {
      Alert.alert(
        `내가 만든 운동 약속을 가져오는데 실패하였습니다: ${error.message}`,
      );
      console.log(error);
    },
    onSuccess(data) {
      console.log('내가 만든 운동 약속', data);
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetWorkoutJoinedByUserIdQuery(userId: string) {
  return useInfiniteQuery({
    queryKey: ['getWorkoutJoinedByUserId', userId],
    queryFn: ({ pageParam = 0 }) =>
      getWorkoutPromiseJoinedByUserId(userId, pageParam),
    retry: 1,
    getNextPageParam: lastPage => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: firstPage => {
      if (firstPage.prevCursor === undefined) {
        return undefined;
      }
      return firstPage.prevCursor;
    },
    onError: (error: Error) => {
      Alert.alert(
        `내가 참여한 운동 약속을 가져오는데 실패하였습니다: ${error.message}`,
      );
      console.log(error);
    },
    onSuccess(data) {
      console.log('내가 참여한 운동 약속', data);
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function usePutWorkoutStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutPromiseInfo,
    onError: (error: Error) => {
      Alert.alert(`모집을 마감할 수 없습니다: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('모집 마감을 완료하였어요!');
      queryClient.invalidateQueries(['getWorkoutById', data.id]);
    },
  });
}

export function usePutWorkoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutPromiseInfo,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 수정할 수 없어요: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('운동 수정을 완료하였어요!');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
      queryClient.invalidateQueries(['getWorkoutById', data.id]);
    },
  });
}
