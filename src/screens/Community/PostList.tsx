import { StyleSheet, Text, View } from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
import { CommunityStackScreenProps } from '/navigators/types';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Button, Divider } from 'react-native-paper';
import { ErrorBoundary } from 'react-error-boundary';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { FallbackProps } from 'react-error-boundary';
import { usePostListQuery } from '/hooks/queries/post.queries';
import PostListItem from '/components/organisms/Community/PostListItem';
import CustomFAB from '/components/molecules/Home/CustomFAB';

type PostListScreenProps = CommunityStackScreenProps<'PostList'>;
export default function PostListScreen({ navigation }: PostListScreenProps) {
  const navigateToPostDetail = useCallback(
    (postId: number) => {
      navigation.push('PostDetail', { postId });
    },
    [navigation],
  );
  const communityId = undefined;
  const { data, hasNextPage, fetchNextPage, refetch } =
    usePostListQuery(communityId);

  const { reset } = useQueryErrorResetBoundary();

  const renderError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => (
      <View style={styles.errorContainer}>
        <Text>커뮤니티 글 목록을 불러올 수 없습니다.</Text>
        <Text>{error.message}</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: PostRead }) => (
      <PostListItem
        post={item}
        user={item.user}
        onPress={navigateToPostDetail}
      />
    ),
    [navigateToPostDetail],
  );
  const renderDivider = useCallback(() => {
    return <Divider />;
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    setIsRefreshing(false);
  }, [refetch]);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={props => renderError({ ...props })}>
        <>
          <FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={data?.pages.flatMap(page => page.items)}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            ItemSeparatorComponent={renderDivider}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            // TODO: onEndReadched Debugging , Debounce..
            // Threshold를 0.7로 설정하면, 스크롤이 끝에 도달했을 때, 70%의 높이를 넘어서야 onEndReached가 호출된다.?
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.7}
            ListEmptyComponent={
              <View style={styles.errorContainer}>
                <Text>커뮤니티 글이 없습니다.</Text>
              </View>
            }
          />
          <CustomFAB
            icon="create"
            onPress={() => {
              navigation.push('PostCreate');
            }}
          />
        </>
      </ErrorBoundary>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Filter Chips
  stickyHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexGrow: 1,
  },
});
