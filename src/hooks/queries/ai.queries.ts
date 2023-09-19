import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAiCoaching,
  postLikeAiCoaching,
  postDisLikeAiCoaching,
} from '/api/api';

export function useGetAiCoachingQuery(postId: number) {
  return useQuery({
    queryKey: ['getAiCoaching', postId],
    queryFn: () => getAiCoaching(postId),
    retry: 0,
    suspense: true,
  });
}

export function useAiCoachingLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLikeAiCoaching,
    onSuccess: data => {
      queryClient.setQueryData(['getAiCoaching', data.postId], data);
    },
  });
}

export function useAiCoachingDisLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDisLikeAiCoaching,
    onSuccess: data => {
      queryClient.setQueryData(['getAiCoaching', data.postId], data);
    },
  });
}
