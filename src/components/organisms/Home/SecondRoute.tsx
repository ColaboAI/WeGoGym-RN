import React, { Suspense, useCallback, useState } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { StyleSheet, View } from 'react-native';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import WorkoutPromiseCard from '/components/molecules/Home/WorkoutPromiseCard';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { useGetWorkoutJoinedByUserIdQuery } from '/hooks/queries/workout.queries';

type Props = {
  navigateToPromiseDetails: (id: string) => void;
};

// 내가 참여한 운동 약속
const SecondRoute = ({ navigateToPromiseDetails }: Props) => {
  const { reset } = useQueryErrorResetBoundary();
  const theme = useTheme();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useGetWorkoutJoinedByUserIdQuery('me');
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <Suspense fallback={<WorkoutPromiseLoader />}>
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
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={`work-promise-container-${item.id}`}
                onPress={() => {
                  navigateToPromiseDetails(item.id);
                }}>
                <WorkoutPromiseCard key={`work-promise-${item.id}`} {...item} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <ActivityIndicator animating={isFetchingNextPage} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>참여한 운동 약속이 아직 없어요😅</Text>
                <Text>운동 약속에 참여해보세요!</Text>
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
});

export default SecondRoute;
