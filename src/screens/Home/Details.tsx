import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import React, { Suspense, useEffect } from 'react';
import { HomeStackParamList, HomeStackScreenProps } from 'navigators/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Text, Chip, useTheme, Headline, Button } from 'react-native-paper';
import { getLocaleDate, getLocaleTime } from 'utils/util';
import { useGetWorkoutByIdQuery } from '/hooks/queries/workout.queries';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
type HomeScreenProps = HomeStackScreenProps<'Details'>;
// type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;

export default function DetailsScreen({ route }: HomeScreenProps) {
  const theme = useTheme();
  const { workoutPromiseId } = route.params;
  const query = useGetWorkoutByIdQuery(workoutPromiseId);
  const { reset } = useQueryErrorResetBoundary();
  useEffect(() => {
    console.log('query', query);
  }, [query]);

  return (
    <Suspense fallback={<WorkoutPromiseLoader />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Headline>
            There was an error!
            <Button
              onPress={() => {
                resetErrorBoundary();
                Alert.alert("I'm error boundary");
              }}>
              Try again
            </Button>
          </Headline>
        )}>
        <ScrollView style={style.container}>
          {query.data ? (
            <>
              <View style={style.title}>
                <Chip style={style.chip}>모집 중</Chip>
                <Text
                  variant="headlineLarge"
                  style={{
                    color: theme.colors.primary,
                    fontSize: 20,
                    fontWeight: '600',
                  }}>
                  {query.data.title}
                </Text>
              </View>
              <View style={style.workoutPromiseInfo}>
                <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
                  📅 {getLocaleDate(query.data.promiseTime)}{' '}
                  {getLocaleTime(query.data.promiseTime)}
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
                  📍{' '}
                  {query.data.gymInfo ? query.data.gymInfo.name : '위치 미정'}
                </Text>
                <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
                  👥 {query.data.participants.length}/
                  {query.data.maxParticipants} 참여
                </Text>
                <Text variant="bodyLarge" style={{ marginBottom: 6 }}>
                  {query.data.description}
                </Text>
                <View style={style.participant}>
                  <Text variant="labelLarge">참여중인 짐메이트 1/ 5</Text>
                  {/* // TODO: 프로필 사진 */}
                </View>
              </View>
            </>
          ) : (
            <WorkoutPromiseLoader />
          )}
        </ScrollView>
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  chip: {
    marginRight: 12,
  },
  workoutPromiseInfo: { marginBottom: 12, marginHorizontal: 12 },
  participant: {},
});
