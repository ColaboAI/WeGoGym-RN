import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getPostList,
  postPost,
  updatePost,
  postDisLikePost,
  postLikePost,
  getPost,
  deletePost,
} from '/api/api';

import { useSnackBarActions } from '../context/useSnackbar';
import { useNavigation } from '@react-navigation/native';

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
  const nav = useNavigation();
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
      nav.goBack();
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
  const nav = useNavigation();
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
    }) => updatePost({ id: postId, params, images }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['postList']);
      queryClient.invalidateQueries(['post', variables.postId]);
      onShow('게시글 수정에 성공하였습니다.', 'success');
      nav.goBack();
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 수정에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

function postLikeUpdater(
  oldData: InfiniteData<PostListRead> | undefined,
  data: PostRead,
  postId: number,
) {
  if (oldData === undefined) {
    return;
  }
  const newData = oldData.pages.map(page => {
    const newPage = page.items.map(result => {
      if (result.id === postId) {
        return {
          ...result,
          isLiked: data.isLiked,
          likeCnt: data.likeCnt,
        };
      }
      return result;
    });
    return { ...page, items: newPage };
  });
  return { ...oldData, pages: newData };
}

export function usePostLikeMutation(communityId: number | undefined) {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: (postId: number) => postLikePost(postId),
    onSuccess: (data, variables) => {
      const postId = variables;
      queryClient.setQueryData<PostRead>(['post', postId], data);
      queryClient.setQueryData<InfiniteData<PostListRead>>(
        ['postList', undefined],
        (oldData: InfiniteData<PostListRead> | undefined) => {
          return postLikeUpdater(oldData, data, postId);
        },
      );
      if (communityId !== undefined) {
        queryClient.setQueryData<InfiniteData<PostListRead>>(
          ['postList', communityId],
          (oldData: InfiniteData<PostListRead> | undefined) => {
            return postLikeUpdater(oldData, data, postId);
          },
        );
      }
    },
    onError: (error: CustomError) => {
      onShow(
        `게시글 좋아요에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostDisLikeMutation(communityId: number | undefined) {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: (postId: number) => postDisLikePost(postId),
    onSuccess: (data, variables) => {
      const postId = variables;
      queryClient.setQueryData<PostRead>(['post', postId], data);
      queryClient.setQueryData<InfiniteData<PostListRead>>(
        ['postList', undefined],
        (oldData: InfiniteData<PostListRead> | undefined) => {
          return postLikeUpdater(oldData, data, postId);
        },
      );
      if (communityId !== undefined) {
        queryClient.setQueryData<InfiniteData<PostListRead>>(
          ['postList', communityId],
          (oldData: InfiniteData<PostListRead> | undefined) => {
            return postLikeUpdater(oldData, data, postId);
          },
        );
      }
    },
    onError: (error: CustomError) => {
      onShow(
        `요청 처리를 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function usePostDeleteMutation(communityId: number | undefined) {
  const queryClient = useQueryClient();
  const { onShow } = useSnackBarActions();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: (_, variables) => {
      queryClient.setQueriesData<InfiniteData<PostListRead>>(
        ['postList', communityId, undefined],
        oldData => {
          if (oldData === undefined) {
            return;
          }
          const newData = oldData.pages.map(page => {
            const newPage = page.items.filter(
              result => result.id !== variables,
            );
            return { ...page, items: newPage };
          });
          return { ...oldData, pages: newData };
        },
      );
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
