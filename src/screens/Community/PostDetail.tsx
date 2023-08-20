import { StyleSheet, Text, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import PostDetailSection from '/components/organisms/Community/PostDetailSection';
import { CommunityStackScreenProps } from '/navigators/types';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Divider } from 'react-native-paper';
import { useCommentListQuery } from '/hooks/queries/comment.queries';
import CommentListItem from '/components/organisms/Community/CommentListItem';

type PostDetailScreenProps = CommunityStackScreenProps<'PostDetail'>;

const PostDetail = ({ route }: PostDetailScreenProps) => {
  const { postId } = route.params;
  const { data, hasNextPage, fetchNextPage } = useCommentListQuery(postId);
  const { reset } = useQueryErrorResetBoundary();

  const renderCommentError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => (
      <View style={styles.errorContainer}>
        <Text>댓글을 불러올 수 없습니다.</Text>
        <Text>{error.message}</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );
  const renderItem = useCallback(
    ({ item }: { item: CommentRead }) => <CommentListItem comment={item} />,
    [],
  );
  const renderDivider = useCallback(() => {
    return <Divider />;
  }, []);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={props => renderCommentError({ ...props })}>
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={<PostDetailSection postId={postId} />}
          data={data?.pages.flatMap(page => page.items)}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={renderDivider}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
});
