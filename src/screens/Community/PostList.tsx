import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { CommunityStackScreenProps } from '/navigators/types';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ActivityIndicator, Button, Divider } from 'react-native-paper';
import { ErrorBoundary } from 'react-error-boundary';
import { RefreshControl } from 'react-native-gesture-handler';
import { FallbackProps } from 'react-error-boundary';
import { usePostListQuery } from '/hooks/queries/post.queries';
import PostListItem from '/components/organisms/Community/PostListItem';
import CustomFAB from '/components/molecules/Home/CustomFAB';
import TextLogo from '/asset/svg/TextLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityChipsHeader from '../../components/molecules/Community/CommunityChipsHeader';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { trigger } from 'react-native-haptic-feedback';

type PostListScreenProps = CommunityStackScreenProps<'PostList'>;

export default function PostListScreen({ navigation }: PostListScreenProps) {
  const navigateToPostDetail = useCallback(
    (postId: number) => {
      navigation.push('PostDetail', { postId });
    },
    [navigation],
  );
  const [selectedCommunity, setSelectedCommunity] = useState<
    Community | undefined
  >(undefined);
  const communityId = useSharedValue<number | undefined>(undefined);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    isLoading,
    isFetchingNextPage,
  } = usePostListQuery(selectedCommunity?.id);

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

  const inset = useSafeAreaInsets();

  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const initialMarginTop = useMemo(() => {
    return Platform.OS === 'android' ? 15 : inset.top;
  }, [inset.top]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 0;
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = -inset.top - 15 - 40;
      }
      lastContentOffset.value = event.contentOffset.y;

      if (event.contentOffset.y === 0) {
        translateY.value = 0;
      }
    },
    onBeginDrag: () => {
      'worklet';
      isScrolling.value = true;
    },
    onEndDrag: () => {
      'worklet';
      isScrolling.value = false;
    },
  });

  const headerAnim = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, -100],
      [1, 0],
      Extrapolate.CLAMP,
    );
    const height = interpolate(
      translateY.value,
      [0, -100],
      [40 + 15, 0],
      Extrapolate.CLAMP,
    );

    const marginTop = interpolate(
      translateY.value,
      [0, -100],
      [initialMarginTop, inset.top],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
      opacity: withTiming(opacity, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
      height: withTiming(height, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
      marginTop: withTiming(marginTop, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const handleCommunityChange = useCallback(
    (community: Community | undefined) => {
      communityId.value = community?.id;
      setSelectedCommunity(community);
      trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      onRefresh();
    },
    [communityId, onRefresh],
  );

  const renderHeader = useCallback(
    () => (
      <Animated.View style={[styles.headerContainer, headerAnim]}>
        <TextLogo customStyle={[styles.logo]} />
        <Animated.View style={[styles.iconContainer]}>
          <CommunityChipsHeader
            selected={selectedCommunity}
            handleSelect={handleCommunityChange}
          />
        </Animated.View>
      </Animated.View>
    ),
    [headerAnim, handleCommunityChange, selectedCommunity],
  );
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={props => renderError({ ...props })}>
      <Suspense fallback={<ActivityIndicator animating={isLoading} />}>
        <>
          {renderHeader()}
          <Animated.FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            data={data?.pages.flatMap(page => page.items)}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            ItemSeparatorComponent={renderDivider}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            refreshing={isRefreshing}
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
            ListFooterComponent={
              <ActivityIndicator animating={isFetchingNextPage} />
            }
            onScroll={scrollHandler}
          />
          <CustomFAB
            icon="create"
            onPress={() => {
              navigation.push('PostCreate');
            }}
          />
        </>
      </Suspense>
    </ErrorBoundary>
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
  headerContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 5,
    marginBottom: Platform.OS === 'android' ? 15 : 0,
  },
});
