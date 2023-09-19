import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import PostDetailAiBody from '/components/molecules/Community/PostDetailAiBody';
import PostDetailAiFooter from '/components/molecules/Community/PostDetailAiFooter';
import { useGetAiCoachingQuery } from '/hooks/queries/ai.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
type Props = {
  postId: number;
};

export default function PostDetailAiSection({ postId }: Props) {
  const { data: aiCoaching } = useGetAiCoachingQuery(postId);
  const { reset } = useQueryErrorResetBoundary();
  const renderAiCoachingError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => {
      return (
        <View style={styles.errorContainer}>
          AI 답변을 불러올 수 없습니다.
          <Text>{error.message}</Text>
          <Button onPress={() => resetErrorBoundary()}>다시 시도하기</Button>
        </View>
      );
    },
    [],
  );

  return (
    <ErrorBoundary onReset={reset} fallbackRender={renderAiCoachingError}>
      <Suspense fallback={<ActivityIndicator animating />}>
        {aiCoaching && (
          <View style={styles.container}>
            <View style={styles.aiSection}>
              <PostDetailAiBody aiCoaching={aiCoaching} />
              <PostDetailAiFooter
                aiCoachingId={aiCoaching.id}
                likes={aiCoaching.likeCnt}
                isLiked={aiCoaching.isLiked}
              />
            </View>
          </View>
        )}
        {/* TODO: RETRY ai coaching request ? */}
        {/* {!aiCoaching && (
          <View style={styles.errorContainer}>
            <Text>AI 답변이 없습니다.</Text>
            <Button onPress={() => reset()}>생성 요청하기</Button>
          </View>
        )} */}
        <Divider />
      </Suspense>
    </ErrorBoundary>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
