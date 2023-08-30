import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from '@tanstack/react-query';
import { useSnackBarActions } from 'hooks/context/useSnackbar';
import {
  postComment,
  patchComment,
  getCommentList,
  deleteComment,
  postLikeComment,
  postDisLikeComment,
  getComment,
} from '/api/api';

export function useCommentListQuery(postId: number) {
  const { onShow } = useSnackBarActions();
  return useInfiniteQuery({
    queryKey: ['commentList', postId],
    queryFn: ({ pageParam = 0 }) =>
      getCommentList({ postId, offset: pageParam }),
    retry: 1,
    suspense: true,
    onError: (error: CustomError) => {
      onShow(
        `댓글 목록을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
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

export function useCommentByIdQuery(id: number | null) {
  const { onShow } = useSnackBarActions();
  return useQuery({
    queryKey: ['comment', id],
    queryFn: () => {
      if (id) {
        return getComment(id);
      }
      return null;
    },
    retry: 1,
    suspense: true,
    onError: (error: CustomError) => {
      onShow(
        `댓글을 가져오는데 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useCommentMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['commentList', variables.postId]);
    },
    onError: (error: CustomError) => {
      onShow(
        `댓글 작성에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useCommentUpdateMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: CommentUpdate }) =>
      patchComment({ id, params }),
    onSuccess: (data, variables) => {
      queryClient.setQueriesData<InfiniteData<CommentListRead>>(
        ['commentList', data.postId],
        old => {
          if (old) {
            return {
              ...old,
              pages: old.pages.map(page => {
                return {
                  ...page,
                  items: page.items.map(comment => {
                    if (comment.id === variables.id) {
                      return {
                        ...comment,
                        ...variables.params,
                      };
                    }
                    return comment;
                  }),
                };
              }),
            };
          }
          return old;
        },
      );
      onShow('댓글이 수정되었습니다', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `댓글 수정에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useCommentDeleteMutation(postId: number) {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['commentList', postId]);
      onShow('댓글이 삭제되었습니다', 'success');
    },
    onError: (error: CustomError) => {
      onShow(
        `댓글 삭제에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useCommentLikeMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLikeComment,
    onSuccess: data => {
      queryClient.invalidateQueries(['commentList', data.postId]);
    },
    onError: (error: CustomError) => {
      onShow(
        `댓글 좋아요에 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}

export function useCommentDisLikeMutation() {
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDisLikeComment,
    onSuccess: data => {
      queryClient.invalidateQueries(['commentList', data.postId]);
    },
    onError: (error: CustomError) => {
      onShow(
        `요청 처리를 실패하였습니다: ${error.response?.data.message}`,
        'error',
      );
    },
  });
}
