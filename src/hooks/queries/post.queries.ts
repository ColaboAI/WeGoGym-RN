import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getPostList,
  postPost,
  patchPost,
  postDisLikePost,
  postLikePost,
  getPost,
  deletePost,
} from '/api/api';

import { useSnackBarActions } from '../context/useSnackbar';

export function usePostListQuery(communityId: number | undefined) {
  const { onShow } = useSnackBarActions();
  return useInfiniteQuery({
    queryKey: ['postList', communityId],
    queryFn: ({ pageParam = 0 }) =>
      getPostList({
        communityId: communityId,
        offset: pageParam,
      }),
    retry: 1,
    suspense: true,
    onError: (error: CustomError) => {
      onShow(
        `게시글 목록을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
    getNextPageParam: (lastPage, _) => {
      if (lastPage.nextCursor === undefined) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    getPreviousPageParam: (firstPage, _) => {
      if (firstPage.nextCursor === undefined) {
        return undefined;
      }
      return firstPage.nextCursor;
    },
  });
}

export function usePostQuery(postId: number) {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    retry: 1,
    suspense: true,
    onError: (error: CustomError) => {
      onShow(
        `게시글을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostMutation() {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({
      params,
      images,
    }: {
      params: PostCreate;
      images: FormData;
    }) => postPost({ params, images }),
    onSuccess: () => {
      queryClient.invalidateQueries(['postList']);
      onShow('게시글 작성에 성공하였습니다.', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 작성에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostUpdateMutation() {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({
      postId,
      params,
      images,
    }: {
      postId: number;
      params: PostUpdate;
      images: FormData;
    }) => patchPost({ id: postId, params, images }),
    onSuccess: () => {
      queryClient.invalidateQueries(['postList']);
      onShow('게시글 수정에 성공하였습니다.', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 수정에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostLikeMutation() {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) => postLikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['postList']);
      onShow('게시글 좋아요에 성공하였습니다.', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 좋아요에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostDisLikeMutation() {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) => postDisLikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['postList']);
      onShow('의견을 게시자에게 공유했습니다.', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `요청 처리를 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useDeletePosttMutation() {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['postList']);
      onShow('게시글 삭제에 성공하였습니다.', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 삭제에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}
