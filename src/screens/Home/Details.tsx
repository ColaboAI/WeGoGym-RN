import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import React, { Suspense, useCallback, useMemo, useState } from 'react';
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
  getDday,
  getLocaleDate,
  getLocaleTime,
  getMyParticipant,
  isAcceptedParticipant,
  isAdmin,
  isRecruitedEnded,
  isRecruiting,
  isRequested,
} from 'utils/util';
import {
  useGetWorkoutByIdQuery,
  useWorkoutDeleteMutation,
  useWorkoutParticipantDeleteMutation,
  usePutWorkoutStatusMutation,
} from '/hooks/queries/workout.queries';
import WorkoutPromiseLoader from '/components/molecules/Home/WorkoutPromiseLoader';
import { ErrorBoundary } from 'react-error-boundary';
import {
  useQueryClient,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParticipationBottomSheet from '/components/organisms/User/ParticipationBottomSheet';
import { useGetUserInfoQuery } from '/hooks/queries/user.queries';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import CustomFAB from '/components/molecules/Home/CustomFAB';
import { useChatRoomMutation } from '/hooks/queries/chat.queries';
import { postChatRoomMember } from '/api/api';
type HomeScreenProps = HomeStackScreenProps<'Details'>;

export default function DetailsScreen({ navigation, route }: HomeScreenProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { workoutPromiseId } = route.params;
  const query = useGetWorkoutByIdQuery(workoutPromiseId);
  const { data: myInfo } = useGetUserInfoQuery('me');
  const deleteWorkoutMutation = useWorkoutDeleteMutation();
  const deleteParticipationMutation =
    useWorkoutParticipantDeleteMutation(workoutPromiseId);
  const updateWorkoutStatusMutation = usePutWorkoutStatusMutation();
  const { reset } = useQueryErrorResetBoundary();
  const inset = useSafeAreaInsets();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const chatRoomMutation = useChatRoomMutation();
  const onPressParticipation = useCallback(async () => {
    setIsBottomSheetOpen(true);
  }, []);

  const navigationToPromiseEdit = useCallback(
    (workoutInfo: WorkoutPromiseRead) => {
      navigation.navigate('PromiseEdit', { workoutInfo });
    },
    [navigation],
  );

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
          navigation.goBack();
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

  const onRecruitEnd = () => {
    Alert.alert('모집을 마감하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          const data = {
            workoutPromiseId,
            workoutPromise: {
              status: 'RECRUIT_ENDED',
            },
            gymInfo: null,
          };
          updateWorkoutStatusMutation.mutate(data);
        },
        style: 'destructive',
      },
    ]);
  };
  // TODO: Refactor
  const isChatButtonDisabled = useMemo(() => {
    if (!query.data || !myInfo) {
      return true;
    }

    if (query.data.participants.length < 2) {
      return true;
    }

    const myParticipation = getMyParticipant(
      query.data.participants,
      myInfo.id,
    );
    if (!myParticipation) {
      return true;
    }
    // 약속 참여자인 경우만 활성화 + 어드민 아닌 경우 채팅방 개설 전까지 비활성화
    if (myParticipation) {
      if (myParticipation.status === 'ACCEPTED') {
        if (
          myParticipation.isAdmin !== true &&
          query.data.chatRoomId === null
        ) {
          return true;
        }
      } else {
        // 참여자가 아닌 경우
        return true;
      }
    } else {
      return true;
    }

    return false;
  }, [myInfo, query.data]);

  const onPressChat = (
    myId: string | undefined,
    adminUserId: string | undefined,
  ) => {
    if (!myId || !adminUserId || isChatButtonDisabled || !query.data) {
      return;
    }
    const { chatRoomId } = query.data;
    const isAdminUser = myId === adminUserId;

    const myParticipation = getMyParticipant(query.data.participants, myId);

    if (chatRoomId) {
      if (myParticipation) {
        if (myParticipation.chatRoomMemberId) {
          Alert.alert('채팅방으로 이동하시겠습니까?', '', [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('MainNavigator', {
                  screen: '채팅',
                  params: {
                    screen: 'ChatRoom',
                    params: {
                      chatRoomId: chatRoomId,
                      chatRoomName: query.data.title,
                      isGroupChat: true,
                    },
                  },
                });
              },
            },
          ]);
        } else {
          // 채팅방에 참여하지 않은 경우
          Alert.alert('채팅방에 참여하시겠습니까?', '', [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: async () => {
                await postChatRoomMember(chatRoomId, myId);

                navigation.navigate('MainNavigator', {
                  screen: '채팅',
                  params: {
                    screen: 'ChatRoom',
                    params: {
                      chatRoomId: chatRoomId,
                      chatRoomName: query.data.title,
                      isGroupChat: true,
                    },
                  },
                });
              },
            },
          ]);
        }
      }
    } else {
      if (isAdminUser) {
        Alert.alert('채팅방을 개설하시겠습니까?', '', [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: async () => {
              // Post ChatRoom With Members
              const res = await chatRoomMutation.mutateAsync({
                adminUserId: myId,
                membersUserIds: query.data.participants.map(
                  participant => participant.userId,
                ),
                isGroupChat: true,
                isPrivate: true,
                name: query.data.title,
                description: query.data.description,
                workoutPromiseId: query.data.id,
              });

              queryClient.setQueryData<WorkoutPromiseRead>(
                ['workoutPromise', workoutPromiseId],
                prev => {
                  if (!prev) {
                    return prev;
                  }
                  return {
                    ...prev,
                    chatRoomId: res.id,
                  };
                },
              );

              navigation.navigate('채팅', {
                screen: 'ChatRoom',
                params: {
                  chatRoomId: res.id,
                  chatRoomName: res.name,
                },
              });
            },
            style: 'destructive',
          },
        ]);
      } else {
        Alert.alert(
          '채팅방이 개설되지 않았습니다.',
          '운동 약속 관리자가 개설할 수 있습니다.',
          [
            {
              text: '확인',
            },
          ],
        );
      }
    }
  };

  const navigateToUserDetails = useCallback(
    (id: string) => {
      navigation.push('User', { userId: id });
    },
    [navigation],
  );

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
        <>
          <View style={[style.container, { marginBottom: inset.bottom }]}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}>
              {query.data && myInfo ? (
                <View style={style.container}>
                  <ScrollView>
                    <View style={style.headerBox}>
                      <View style={style.chipBox}>
                        {isRecruiting(query.data.status) ? (
                          <>
                            <Chip style={style.chip}>모집 중</Chip>
                            <Chip style={style.chip}>
                              {getDday(query.data.promiseTime)}
                            </Chip>
                          </>
                        ) : (
                          <Chip
                            style={[
                              style.chip,
                              {
                                backgroundColor: theme.colors.surfaceDisabled,
                              },
                            ]}>
                            모집 완료
                          </Chip>
                        )}
                      </View>
                      <View style={style.iconBox}>
                        {isAdmin(myInfo.id, query.data.adminUserId) ? (
                          <>
                            {isRecruiting(query.data.status) ? (
                              <IconButton
                                icon="create-outline"
                                onPress={() => {
                                  navigationToPromiseEdit(query.data);
                                }}
                              />
                            ) : null}
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
                          name="barbell-outline"
                          size={20}
                          color={theme.colors.onBackground}
                          style={style.icon}
                        />
                        {query.data.workoutPart ? (
                          query.data.workoutPart
                            .split(',')
                            .map((part, index) => (
                              <Text
                                variant="bodyLarge"
                                style={style.body}
                                key={index}>
                                {part}
                                {index !==
                                query.data.workoutPart.split(',').length - 1
                                  ? ', '
                                  : ''}
                              </Text>
                            ))
                        ) : (
                          <Text variant="bodyLarge" style={style.body}>
                            운동 부위 미정
                          </Text>
                        )}
                      </View>
                      <Divider />
                      <View style={style.descriptionBox}>
                        <Text variant="bodyLarge" style={style.body}>
                          {query.data.description}
                        </Text>
                      </View>
                      <View style={style.participant}>
                        <Text variant="bodyLarge">참여 중인 짐메이트</Text>
                        <Text
                          variant="bodyLarge"
                          style={{ color: theme.colors.primary }}>
                          {' '}
                          {
                            isAcceptedParticipant(query.data.participants)
                              .length
                          }
                        </Text>
                        <Text variant="bodyLarge">
                          /{query.data.maxParticipants}
                        </Text>
                      </View>
                      <View style={style.participantList}>
                        {isAcceptedParticipant(query.data.participants).map(
                          participant => (
                            <View key={participant.id} style={style.avatarBox}>
                              <Pressable
                                disabled={participant.userId === myInfo.id}
                                onPress={() => {
                                  navigateToUserDetails(participant.userId);
                                }}>
                                <CustomAvatar
                                  size={40}
                                  profilePic={participant.user.profilePic}
                                  username={participant.user.username}
                                  style={style.avatar}
                                />
                              </Pressable>
                              {participant.isAdmin ? (
                                <View
                                  style={[
                                    style.adminIconBox,
                                    {
                                      backgroundColor: theme.colors.tertiary,
                                    },
                                  ]}>
                                  <IconButton
                                    icon="barbell-outline"
                                    iconColor={theme.colors.onTertiary}
                                    size={12}
                                    style={style.adminIcon}
                                  />
                                </View>
                              ) : null}
                            </View>
                          ),
                        )}
                      </View>
                    </View>
                  </ScrollView>
                  {isAdmin(myInfo.id, query.data.adminUserId) &&
                  isRecruiting(query.data.status) ? (
                    <Button
                      mode="contained"
                      onPress={onRecruitEnd}
                      style={style.button}
                      disabled={
                        isAcceptedParticipant(query.data.participants).length <
                        2
                      }>
                      모집 완료
                    </Button>
                  ) : isRecruitedEnded(query.data.status) ? (
                    <Button
                      mode="contained"
                      disabled={true}
                      onPress={() => {}}
                      style={style.button}>
                      모집 마감
                    </Button>
                  ) : isRequested(query.data.participants, myInfo.id) ? (
                    <Button
                      mode="contained"
                      onPress={() => {
                        onDeleteParticipation(myInfo.id);
                      }}
                      style={style.button}>
                      참여 취소
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={onPressParticipation}
                      style={style.button}>
                      참여 요청
                    </Button>
                  )}
                </View>
              ) : (
                <WorkoutPromiseLoader
                  backgroundColor={theme.colors.background}
                  foregroundColor={theme.colors.surfaceVariant}
                />
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
            {isBottomSheetOpen ? (
              <></>
            ) : (
              <CustomFAB
                icon="chatbubbles"
                customStyle={style.fab}
                disabled={isChatButtonDisabled}
                onPress={() => {
                  onPressChat(myInfo?.id, query.data?.adminUserId);
                }}
              />
            )}
          </View>
        </>
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
    marginBottom: 12,
  },
  participantList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  participantBox: {
    flexDirection: 'row',
  },
  avatarBox: {
    alignItems: 'center',
    marginRight: 8,
  },
  usernameBox: {},
  adminIconBox: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 100,
  },
  adminIcon: {},
  avatar: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 30,
  },
});
