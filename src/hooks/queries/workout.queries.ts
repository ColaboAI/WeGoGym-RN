import { useMutation, useQuery } from '@tanstack/react-query';
import { getWorkoutPromise, postWorkoutPromise } from '@api/api';
import { Alert } from 'react-native';

export function useWorkoutMutation() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postWorkoutPromise,
    onError: (error: Error) => {
      Alert.alert(`운동 약속을 만들 수 없어요: ${error.message}`);
    },
    onSuccess(data) {
      console.log(data);
      Alert.alert('운동 약속을 만들었어요!');
      // invalidate the query to refetch the data
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
