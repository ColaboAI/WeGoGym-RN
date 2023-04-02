import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Alert } from 'react-native';
import { getNotificationWorkout, putNotification } from '/api/api';

export function useGetNotificationWorkoutQuery() {
  return useInfiniteQuery({
    queryKey: ['getNotificationWorkout'],
    queryFn: ({ pageParam = 0 }) => getNotificationWorkout(pageParam),
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
      Alert.alert(
        `운동 약속 알림을 가져오는데 실패하였습니다: ${error.message}`,
      );
      console.log(error);
    },
    onSuccess(data) {
      console.log('운동 약속 알림을 가져왔습니다.', data);
    },
    suspense: true,
    keepPreviousData: true,
  });
}
// readAt 수정
export function usePutNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putNotification,
    retry: 1,
    onError: (error: Error) => {
      Alert.alert(`알림을 업데이트하는데 실패하였습니다: ${error.message}`);
      console.log(error);
    },
    onSuccess(data) {
      console.log('알림을 업데이트했습니다.', data);
      queryClient.invalidateQueries(['getNotificationWorkout']);
    },
  });
}
