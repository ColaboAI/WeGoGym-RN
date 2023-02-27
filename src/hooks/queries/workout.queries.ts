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
    initialData: [
      {
        id: 1,
        title: '운동 약속 제목',
        description: '운동 약속 설명',
        maxParticipants: 5,
        promiseTime: '2021-08-01T00:00:00.000Z',
        recruitEndTime: '2021-08-01T00:00:00.000Z',
        isPrivate: false,
        gymInfo: {
          id: 1,
          status: 'ACTIVE',
          name: '헬스장 이름',
          address: '헬스장 주소',
          zipCode: '헬스장 우편번호',
        },
        participants: [
          {
            id: 1,
            user: {
              id: 1,
              username: '유저 이름',
              profile: {
                uri: '유저 프로필 이미지',
                size: 100,
              },
            },
          },
        ],
        createdAt: '2021-08-01T00:00:00.000Z',
        updatedAt: '2021-08-01T00:00:00.000Z',
      },
    ],
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
