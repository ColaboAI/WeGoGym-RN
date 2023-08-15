import { StyleSheet, Text, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { usePostQuery } from '/hooks/queries/post.queries';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import PostListItem from '/components/organisms/Community/PostListItem';
import { CommunityStackScreenProps } from '/navigators/types';

type PostDetailScreenProps = CommunityStackScreenProps<'PostDetail'>;

const PostDetail = ({ route }: PostDetailScreenProps) => {
  const { data } = usePostQuery(route.params.postId);
  const { reset } = useQueryErrorResetBoundary();

  const renderError = useCallback(() => {
    return (
      <View>
        There was an error!
        <button onClick={() => reset()}>Try again</button>
      </View>
    );
  }, [reset]);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary onReset={reset} fallbackRender={renderError}>
        {data && (
          <PostListItem post={data} user={data.user} onPress={() => {}} />
        )}
      </ErrorBoundary>
    </Suspense>
  );
};

export default PostDetail;

const styles = StyleSheet.create({});
