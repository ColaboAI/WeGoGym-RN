import React, { Suspense, useCallback } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { StyleSheet, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import WorkoutPromiseCard from '/components/molecules/Home/WorkoutPromiseCard';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { useGetWorkoutWrittenByUserIdQuery } from '/hooks/queries/workout.queries';

type Props = {
  navigateToPromiseDetails: (id: string) => void;
};

// 내가 만든 운동 약속
const FirstRoute = ({ navigateToPromiseDetails }: Props) => {
  const { reset } = useQueryErrorResetBoundary();
  const theme = useTheme();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetWorkoutWrittenByUserIdQuery('me');

  const renderError = useCallback(
    (resetErrorBoundary: () => void) => (
      <View style={styles.errorContainer}>
        <Text>운동을 불러올 수 없습니다!</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );

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
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
              console.log('end reached');
            }}
            onEndReachedThreshold={0.1}
            initialNumToRender={5}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={`workout-promise-container-${item.id}`}
                onPress={() => {
                  navigateToPromiseDetails(item.id);
                }}>
                <WorkoutPromiseCard
                  key={`workout-promise-${item.id}`}
                  {...item}
                />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <ActivityIndicator animating={isFetchingNextPage} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>운동 약속이 없습니다🙃</Text>
                <Text style={styles.emptyText}>
                  새로운 운동 약속을 만들어보세요!
                </Text>
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
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default FirstRoute;
