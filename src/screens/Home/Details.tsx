import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { HomeStackScreenProps } from 'navigators/types';
import {
  Text,
  Chip,
  useTheme,
  Headline,
  Button,
  Divider,
  IconButton,
} from 'react-native-paper';
import {
  getLocaleDate,
  getLocaleTime,
  isAcceptedParticipant,
  isAdmin,
  isRequested,
} from 'utils/util';
import {
  useGetWorkoutByIdQuery,
  useWorkoutDeleteMutation,
  useWorkoutParticipantDeleteMutation,
} from '/hooks/queries/workout.queries';
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
  const deleteWorkoutMutation = useWorkoutDeleteMutation();
  const deleteParticipationMutation =
    useWorkoutParticipantDeleteMutation(workoutPromiseId);
  const { reset } = useQueryErrorResetBoundary();
  const inset = useSafeAreaInsets();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [isParticipationCancel, setIsParticipationCancel] =
    useState<number>(-1);

  const onPressParticipation = useCallback(async () => {
    setIsBottomSheetOpen(true);
  }, []);

  const navigationToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const onDeleteWorkout = () => {
    Alert.alert('게시글을 삭제하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          deleteWorkoutMutation.mutate(workoutPromiseId);
          navigationToHome();
        },
        style: 'destructive',
      },
    ]);
  };

  const onDeleteParticipation = (userId: string) => {
    Alert.alert('참여를 취소하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          deleteParticipationMutation.mutate({ workoutPromiseId, userId });
        },
        style: 'destructive',
      },
    ]);
  };

  useEffect(() => {
    if (myInfo && query.data) {
      const result = isRequested(query.data.participants, myInfo.id);
      setIsParticipationCancel(result);
    }
  }, [myInfo, query.data]);

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
            {query.data && myInfo ? (
              <View style={style.container}>
                <ScrollView>
                  <>
                    <View style={style.headerBox}>
                      <View style={style.chipBox}>
                        <Chip style={style.chip}>모집 중</Chip>
                      </View>
                      <View style={style.iconBox}>
                        {isAdmin(myInfo.id, query.data.adminUserId) ? (
                          <>
                            <IconButton
                              icon="create-outline"
                              // TODO: 운동 약속 편집 화면으로 이동
                              onPress={() => {}}
                            />
                            <IconButton
                              icon="trash-outline"
                              onPress={onDeleteWorkout}
                            />
                          </>
                        ) : null}
                      </View>
                    </View>
                    <View style={style.titleBox}>
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
                </ScrollView>
                {isAdmin(myInfo.id, query.data.adminUserId) ? (
                  <Button
                    mode="contained"
                    // TODO: 운동 약속 모집 완료
                    onPress={() => {}}
                    style={style.button}>
                    모집 완료
                  </Button>
                ) : isParticipationCancel === 0 ? (
                  <Button
                    mode="contained"
                    onPress={onPressParticipation}
                    style={style.button}>
                    참여 요청
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => {
                      onDeleteParticipation(myInfo.id);
                    }}
                    style={style.button}>
                    참여 취소
                  </Button>
                )}
              </View>
            ) : (
              <WorkoutPromiseLoader />
            )}
          </TouchableWithoutFeedback>
          {myInfo ? (
            <ParticipationBottomSheet
              isBottomSheetOpen={isBottomSheetOpen}
              setIsBottomSheetOpen={setIsBottomSheetOpen}
              workoutPromiseId={workoutPromiseId}
              username={myInfo.username}
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
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  body: {
    marginBottom: 12,
    fontWeight: '500',
  },
  chipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
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
