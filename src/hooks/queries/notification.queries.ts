import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getNotificationWorkout, putNotification } from '/api/api';
import { useSnackBarActions } from '../context/useSnackbar';

export function useGetNotificationWorkoutQuery() {
  const { onShow } = useSnackBarActions();
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
    onError: (error: CustomError) => {
      onShow(
        `운동 약속 알림을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    suspense: true,
    keepPreviousData: true,
  });
}
// readAt 수정
export function usePutNotificationMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putNotification,
    retry: 1,
    onError: (error: CustomError) => {
      onShow(
        `알림을 업데이트하는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    onSuccess() {
      queryClient.invalidateQueries(['getNotificationWorkout']);
    },
  });
}
