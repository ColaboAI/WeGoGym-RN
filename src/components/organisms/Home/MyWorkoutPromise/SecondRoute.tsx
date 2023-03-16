import React, { Suspense, useCallback } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { StyleSheet, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Text, useTheme } from 'react-native-paper';
import WorkoutPromiseCard from '/components/molecules/Home/WorkoutPromiseCard';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { useGetWorkoutJoinedByUserIdQuery } from '/hooks/queries/workout.queries';

type Props = {
  limit: number;
  offset: number;
  navigateToPromiseDetails: (id: string) => void;
};

// 내가 참여한 운동 약속
const SecondRoute = ({ limit, offset, navigateToPromiseDetails }: Props) => {
  const { reset } = useQueryErrorResetBoundary();
  const theme = useTheme();
  const workoutPromiseJoinedByMeQuery = useGetWorkoutJoinedByUserIdQuery(
    'me',
    limit,
    offset,
  );

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
          {workoutPromiseJoinedByMeQuery.data ? (
            <FlatList
              data={workoutPromiseJoinedByMeQuery.data.items}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.workoutPromiseContainer}
              initialNumToRender={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={`work-promise-container-${item.id}`}
                  onPress={() => {
                    navigateToPromiseDetails(item.id);
                  }}>
                  <WorkoutPromiseCard
                    key={`work-promise-${item.id}`}
                    {...item}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    참여한 운동 약속이 아직 없어요😅
                  </Text>
                  <Text style={styles.emptyText}>
                    운동 약속에 참여해보세요!
                  </Text>
                </View>
              }
            />
          ) : (
            <WorkoutPromiseLoader />
          )}
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

export default SecondRoute;
