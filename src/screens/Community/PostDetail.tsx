import { Platform, StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import PostDetailSection from '/components/organisms/Community/PostDetailSection';
import { CommunityStackScreenProps } from '/navigators/types';
import { ActivityIndicator, Button, Divider, Text } from 'react-native-paper';
import { useCommentListQuery } from '/hooks/queries/comment.queries';
import CommentListItem from '/components/organisms/Community/CommentListItem';
import { useScrollToTop } from '@react-navigation/native';
import CommentInput from '/components/molecules/Community/CommentInput';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResizeMode } from '/hooks/common/keyboard';
import PostDetailAiSection from '/components/organisms/Community/PostDetailAiSection';
import { RefreshControl } from 'react-native-gesture-handler';
import { defaultHapticOptions, useLightHapticType } from '/hooks/common/haptic';
import { trigger } from 'react-native-haptic-feedback';

type PostDetailScreenProps = CommunityStackScreenProps<'PostDetail'>;

const PostDetail = ({ navigation, route }: PostDetailScreenProps) => {
  const { postId } = route.params;
  const flatlistRef = React.useRef<Animated.FlatList<CommentRead>>(null);
  useScrollToTop(flatlistRef);
  useResizeMode();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useCommentListQuery(postId);

  const inset = useSafeAreaInsets();
  const { height } = useReanimatedKeyboardAnimation();

  const commentInputStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: height.value === 0 ? inset.bottom : 5,
      transform: [{ translateY: height.value }],
    };
  });

  const contentPaddingBottom = useMemo(
    () => ({
      paddingBottom: 60,
    }),
    [],
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: height.value ? Math.abs(height.value) : 0,
    }),
    [height.value],
  );

  //#region render
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

  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );

  const onPressEditComment = useCallback((commentId: number) => {
    setSelectedCommentId(commentId);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: CommentRead }) => (
      <CommentListItem comment={item} onPressEditComment={onPressEditComment} />
    ),
    [onPressEditComment],
  );

  const renderDivider = useCallback(() => {
    return <Divider />;
  }, []);

  const renderFooter = useCallback(() => {
    return isFetchingNextPage ? (
      <ActivityIndicator animating={isFetchingNextPage} />
    ) : null;
  }, [isFetchingNextPage]);
  //#endregion

  const navigateToPostEdit = useCallback(
    (id: number) => {
      navigation.push('PostEdit', { postId: id });
    },
    [navigation],
  );

  const [refreshing, setRefreshing] = useState(false);
  const hapticType = useLightHapticType();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    trigger(hapticType, defaultHapticOptions);
    setRefreshing(false);
  }, [hapticType, refetch]);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={props => renderCommentError({ ...props })}>
          <Suspense fallback={<ActivityIndicator animating={isLoading} />}>
            <View style={styles.postDetailContainer}>
              <Animated.FlatList
                ref={flatlistRef}
                style={[styles.container]}
                contentContainerStyle={[
                  styles.contentContainer,
                  contentPaddingBottom,
                ]}
                ListHeaderComponent={
                  <>
                    <PostDetailSection
                      postId={postId}
                      onPressEdit={navigateToPostEdit}
                      isRefreshing={isRefetching}
                    />
                    <PostDetailAiSection
                      postId={postId}
                      isRefreshing={isRefetching}
                    />
                  </>
                }
                ListFooterComponent={renderFooter}
                data={data?.pages.flatMap(page => page.items)}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={renderDivider}
                onEndReached={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
                nestedScrollEnabled={true}
                onEndReachedThreshold={0.1}
                keyboardDismissMode={'interactive'}
                automaticallyAdjustContentInsets={false}
                automaticallyAdjustKeyboardInsets={true}
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                maxToRenderPerBatch={5}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
              <CommentInput
                animatedStyle={commentInputStyle}
                postId={postId}
                selectedCommentId={selectedCommentId}
                setSelectedCommentId={setSelectedCommentId}
              />
              {Platform.OS === 'android' && (
                <Animated.View style={[fakeView]} />
              )}
            </View>
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  postDetailContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
