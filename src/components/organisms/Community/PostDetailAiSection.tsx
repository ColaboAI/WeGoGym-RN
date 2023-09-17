import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { Divider, Text } from 'react-native-paper';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { usePostQuery } from '/hooks/queries/post.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import PostDetailAiBody from '/components/molecules/Community/PostDetailAiBody';
import PostDetailAiFooter from '/components/molecules/Community/PostDetailAiFooter';

type Props = {
  postId: number;
};

export default function PostDetailAiSection({ postId }: Props) {
  // const { data: aiCoaching } = useAiCoachingQuery(postId);
  const { data: post } = usePostQuery(postId);
  const { reset } = useQueryErrorResetBoundary();

  const renderPostError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => {
      return (
        <View>
          AI 답변을 불러올 수 없습니다.
          <br />
          <br />
          <Text>{error.message}</Text>
          <button onClick={() => resetErrorBoundary()}>다시 시도하기</button>
        </View>
      );
    },
    [],
  );

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary onReset={reset} fallbackRender={renderPostError}>
        <>
          {post && (
            <View style={styles.container}>
              <View style={styles.aiSection}>
                <PostDetailAiBody
                  post={post}
                  // aiCoaching={aiCoaching}
                />
                <PostDetailAiFooter
                  // aiCoachingId={aiCoaching.id}
                  // likes={aiCoaching.likeCnt}
                  // isLiked={aiCoaching.isLiked}
                  communityId={post.communityId}
                  postId={post.id}
                  likes={post.likeCnt}
                  isLiked={post.isLiked}
                />
              </View>
            </View>
          )}
          <Divider />
        </>
      </ErrorBoundary>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  aiSection: {
    flex: 6,
    flexDirection: 'column',
  },
});
