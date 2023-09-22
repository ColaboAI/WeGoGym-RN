import React, { Suspense, useCallback, useState } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Pressable, StyleSheet, View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import WorkoutPromiseCard from '/components/molecules/Home/WorkoutPromiseCard';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { useGetWorkoutWrittenByUserIdQuery } from '/hooks/queries/workout.queries';
import { defaultHapticOptions, useLightHapticType } from '/hooks/common/haptic';
import { trigger } from 'react-native-haptic-feedback';

type Props = {
  navigateToPromiseDetails: (id: string) => void;
};

// 내가 만든 운동 약속
const FirstRoute = ({ navigateToPromiseDetails }: Props) => {
  const { reset } = useQueryErrorResetBoundary();
  const theme = useTheme();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useGetWorkoutWrittenByUserIdQuery('me');
  const [refreshing, setRefreshing] = useState(false);

  const renderError = useCallback(
    (resetErrorBoundary: () => void) => (
      <View style={styles.errorContainer}>
        <Text>운동을 불러올 수 없습니다!</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );
  const hapticFeedBackType = useLightHapticType();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    trigger(hapticFeedBackType, defaultHapticOptions);
    setRefreshing(false);
  }, [hapticFeedBackType, refetch]);

  return (
    <Suspense
      fallback={
        <WorkoutPromiseLoader
          backgroundColor={theme.colors.background}
          foregroundColor={theme.colors.surfaceVariant}
        />
      }>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) =>
          renderError(resetErrorBoundary)
        }>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}>
          <FlatList
            data={data?.pages.flatMap(page => page.items)}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.workoutPromiseContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.01}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <Pressable
                key={`workout-promise-container-${item.id}`}
                onPress={() => {
                  navigateToPromiseDetails(item.id);
                }}>
                <WorkoutPromiseCard
                  key={`workout-promise-${item.id}`}
                  {...item}
                />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <ActivityIndicator animating={isFetchingNextPage} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>운동 약속이 없습니다🙃</Text>
                <Text>새로운 운동 약속을 만들어보세요!</Text>
              </View>
            }
          />
        </View>
      </ErrorBoundary>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutPromiseContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {},
});

export default FirstRoute;
