import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { Suspense, useCallback, useState } from 'react';
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
import ParticipationBottomSheet from '/components/organisms/User/ParticipationBottomSheet';
import { useGetUserInfoQuery } from '/hooks/queries/user.queries';
type HomeScreenProps = HomeStackScreenProps<'Details'>;

export default function DetailsScreen({ navigation, route }: HomeScreenProps) {
  const theme = useTheme();
  const { workoutPromiseId } = route.params;
  const query = useGetWorkoutByIdQuery(workoutPromiseId);
  const { data: myInfo } = useGetUserInfoQuery('me');
  const { reset } = useQueryErrorResetBoundary();
  const inset = useSafeAreaInsets();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const onPressParticipation = useCallback(async () => {
    setIsBottomSheetOpen(true);
  }, []);

  const navigationToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const isAcceptedParticipant = useCallback(
    (paticipants: WorkoutParictipantsRead[]) => {
      const acceptedParticipants = paticipants.filter(
        participant => participant.status === 'ACCEPTED',
      );
      return acceptedParticipants.length;
    },
    [],
  );

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
        <View style={[style.container, { marginBottom: inset.bottom }]}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View style={style.container}>
              <ScrollView>
                {query.data ? (
                  <>
                    <View style={style.titleBox}>
                      <Chip style={style.chip}>모집 중</Chip>
                      <Text
                        style={[
                          style.title,
                          { color: theme.colors.onBackground },
                        ]}>
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
                          {query.data.gymInfo
                            ? query.data.gymInfo.name
                            : '위치 미정'}
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
                          {isAcceptedParticipant(query.data.participants)}/
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
                        <Text variant="bodyLarge">참여중인 짐메이트</Text>
                        <Text
                          variant="bodyLarge"
                          style={{ color: theme.colors.primary }}>
                          {' '}
                          {isAcceptedParticipant(query.data.participants)}
                        </Text>
                        <Text variant="bodyLarge">
                          /{query.data.maxParticipants}
                        </Text>
                        {/* {query.data.participants.map(participant => (
                          <Text variant="bodyLarge" key={participant.id}>
                            {participant.user.username}
                          </Text>
                        ))} */}
                      </View>
                    </View>
                  </>
                ) : (
                  <WorkoutPromiseLoader />
                )}
              </ScrollView>
              <Button
                mode="contained"
                onPress={onPressParticipation}
                style={style.button}>
                참여 요청
              </Button>
            </View>
          </TouchableWithoutFeedback>
          {myInfo ? (
            <ParticipationBottomSheet
              isBottomSheetOpen={isBottomSheetOpen}
              setIsBottomSheetOpen={setIsBottomSheetOpen}
              workoutPromiseId={workoutPromiseId}
              username={myInfo.username}
              navigationToHome={navigationToHome}
            />
          ) : (
            <></>
          )}
        </View>
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
  participant: {
    flexDirection: 'row',
  },
});
