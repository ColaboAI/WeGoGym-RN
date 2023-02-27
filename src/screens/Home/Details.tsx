import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  InputAccessoryView,
  Platform,
} from 'react-native';
import React, { Suspense } from 'react';
import { HomeStackScreenProps } from 'navigators/types';
import {
  Text,
  Chip,
  useTheme,
  Headline,
  Button,
  Divider,
} from 'react-native-paper';
import { getLocaleDate, getLocaleTime } from 'utils/util';
import { useGetWorkoutByIdQuery } from '/hooks/queries/workout.queries';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type HomeScreenProps = HomeStackScreenProps<'Details'>;

export default function DetailsScreen({ route }: HomeScreenProps) {
  const theme = useTheme();
  const { workoutPromiseId } = route.params;
  const query = useGetWorkoutByIdQuery(workoutPromiseId);
  const { reset } = useQueryErrorResetBoundary();
  const inset = useSafeAreaInsets();

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
        <ScrollView style={[style.container, { marginBottom: inset.bottom }]}>
          {query.data ? (
            <>
              <View style={style.titleBox}>
                <Chip style={style.chip}>모집 중</Chip>
                <Text
                  style={[style.title, { color: theme.colors.onBackground }]}>
                  {query.data.title}
                </Text>
              </View>
              <View style={style.workoutPromiseInfoBox}>
                <View style={style.infoBox}>
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={theme.colors.onBackground}
                    style={style.icon}
                  />
                  <Text variant="bodyLarge" style={style.body}>
                    {getLocaleDate(query.data.promiseTime)}{' '}
                    {getLocaleTime(query.data.promiseTime)}
                  </Text>
                </View>
                <View style={style.infoBox}>
                  <Icon
                    name="location-outline"
                    size={20}
                    color={theme.colors.onBackground}
                    style={style.icon}
                  />
                  <Text variant="bodyLarge" style={style.body}>
                    {query.data.gymInfo ? query.data.gymInfo.name : '위치 미정'}
                  </Text>
                </View>
                <View style={style.infoBox}>
                  <Icon
                    name="people-outline"
                    size={20}
                    color={theme.colors.onBackground}
                    style={style.icon}
                  />
                  <Text variant="bodyLarge" style={style.body}>
                    {query.data.participants.length}/
                    {query.data.maxParticipants} 참여
                  </Text>
                </View>
                <Divider />
                <View style={style.descriptionBox}>
                  <Text variant="bodyLarge" style={style.body}>
                    {query.data.description}
                  </Text>
                </View>
                <View style={style.participant}>
                  <Text variant="labelLarge">참여중인 짐메이트 1 / 5</Text>
                  {/* // TODO: 프로필 사진 */}
                </View>
              </View>
            </>
          ) : (
            <WorkoutPromiseLoader />
          )}
        </ScrollView>
        {Platform.OS === 'ios' ? (
          <InputAccessoryView>
            <Button
              mode="contained-tonal"
              style={style.button}
              onPress={() => {}}>
              참여하기
            </Button>
          </InputAccessoryView>
        ) : (
          <Button
            mode="contained-tonal"
            style={style.button}
            onPress={() => {}}>
            참여하기
          </Button>
        )}
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  body: {
    marginBottom: 12,
    fontWeight: '500',
  },
  chip: {
    marginRight: 12,
  },
  infoBox: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 6,
  },
  workoutPromiseInfoBox: {
    marginBottom: 12,
    marginHorizontal: 12,
  },
  descriptionBox: {
    marginTop: 12,
  },
  button: {
    borderRadius: 0,
  },
  participant: {},
});
