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
  putWorkoutParticipant,
} from '@api/api';
import { Alert } from 'react-native';
import { AxiosError } from 'axios';
import { useSnackBarActions } from '../context/useSnackbar';

export function useWorkoutMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postWorkoutPromise,
    onError: (error: CustomError) => {
      onShow(`운동 약속을 만들 수 없어요: ${error.response?.data}`, 'error');
      Alert.alert(`운동 약속을 만들 수 없어요: ${error.message}`);
    },
    onSuccess() {
      onShow('운동 약속을 만들었어요!', 'success');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
    },
  });
}

export function useWorkoutDeleteMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkoutPromise,
    onError: (error: CustomError) => {
      onShow(
        `운동 약속을 삭제할 수 없어요: ${error.response?.data.message}`,
        'error',
      );
    },
    onSuccess() {
      onShow('운동 약속을 삭제했어요!', 'success');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
    },
  });
}

export function useWorkoutParticipantMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postWorkoutParticipant,
    onError: (error: CustomError) => {
      if (error instanceof AxiosError) {
        // TODO: error handling with error.response?.data

        onShow(
          `${error.response?.data.errorCode}: ${error.response?.data.message}`,
          'error',
        );
      } else {
        onShow(`운동 약속에 참가할 수 없어요: ${error.message}`, 'error');
      }
    },
    onSuccess(data) {
      onShow(
        '운동 약속에 참가 신청을 완료하였어요! 승인을 기다려주세요.',
        'success',
      );
      queryClient.invalidateQueries(['getWorkoutById', data.workoutPromiseId]);
    },
  });
}

export function useWorkoutParticipantDeleteMutation(workoutPromiseId: string) {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkoutParticipant,
    onError: (error: CustomError) => {
      onShow(
        `운동 약속을 취소할 수 없어요: ${error.response?.data.message}`,
        'error',
      );
    },
    onSuccess() {
      onShow(
        '운동 약속 참가 취소 완료하였어요! 다른 운동 약속에 참가해보세요!',
        'success',
      );
      queryClient.invalidateQueries(['getWorkoutById', workoutPromiseId]);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
    },
  });
}

export function useGetWorkoutQuery() {
  const { onShow } = useSnackBarActions();
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
      onShow(
        `운동 약속을 가져오는데 실패하였습니다: ${error.message}`,
        'error',
      );
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetRecruitingWorkoutQuery() {
  const { onShow } = useSnackBarActions();
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
    onError: (error: CustomError) => {
      onShow(
        `운동 약속을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetWorkoutByIdQuery(id: string | undefined) {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['getWorkoutById', id],
    queryFn: () => getWorkoutPromiseById(id),
    retry: 1,
    onError: (error: CustomError) => {
      onShow(
        `운동 약속 정보를 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
      console.log(error);
    },
    suspense: true,
  });
}

export function useGetWorkoutWrittenByUserIdQuery(userId: string) {
  const { onShow } = useSnackBarActions();
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
    onError: (error: CustomError) => {
      onShow(
        `내가 만든 운동 약속을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function useGetWorkoutJoinedByUserIdQuery(userId: string) {
  const { onShow } = useSnackBarActions();
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
    onError: (error: CustomError) => {
      onShow(
        `내가 참여한 운동 약속을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    suspense: true,
    keepPreviousData: true,
  });
}

export function usePutWorkoutStatusMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutPromiseInfo,
    onError: (error: Error) => {
      Alert.alert(`모집을 마감할 수 없습니다: ${error.message}`);
    },
    onSuccess(data) {
      onShow('모집 마감을 완료하였어요!');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutById', data.id]);
    },
  });
}

export function usePutWorkoutMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutPromiseInfo,
    onError: (error: CustomError) => {
      onShow(
        `운동 약속을 수정할 수 없어요: ${error.response?.data.message}`,
        'error',
      );
    },
    onSuccess(data) {
      onShow('운동 수정을 완료하였어요!');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
      queryClient.invalidateQueries(['getWorkoutById', data.id]);
    },
  });
}

export function usePutWorkoutParticipantAcceptMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutParticipant,
    onError: (error: CustomError) => {
      onShow(`승인할 수 없습니다. : ${error.response?.data.message}`, 'error');
    },
    onSuccess() {
      onShow('승인 완료했습니다.');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
    },
  });
}

export function usePutWorkoutParticipantRejectMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putWorkoutParticipant,
    onError: (error: CustomError) => {
      onShow(`거절할 수 없습니다. : ${error.response?.data.message}`, 'error');
    },
    onSuccess() {
      onShow('거절 완료했습니다.');
      queryClient.invalidateQueries(['getWorkout']);
      queryClient.invalidateQueries(['getRecruitingWorkout']);
      queryClient.invalidateQueries(['getWorkoutWrittenByUserId']);
      queryClient.invalidateQueries(['getWorkoutJoinedByUserId']);
    },
  });
}
