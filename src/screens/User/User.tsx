import { StyleSheet, View, SafeAreaView } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Card,
  List,
  Tooltip,
  Button,
  Chip,
  Menu,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import React, { Suspense, useCallback, useState } from 'react';
import { useGetUserInfoQuery } from 'hooks/queries/user.queries';
import GymInfoLoader from 'components/molecules/Home/GymInfoLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ChatParamList, UserStackScreenProps } from '/navigators/types';
import InfoCard from 'components/molecules/User/InfoCard';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { getDirectChatRoom } from '/api/api';
import { getAge } from '/utils/util';
import { useAuthActions } from '/hooks/context/useAuth';
import UserBlockModal from '/components/organisms/Common/UserBlockModal';

type Props = UserStackScreenProps<'User'>;
export default function UserScreen({ navigation, route }: Props) {
  const id: string =
    route.params && route.params.userId ? route.params.userId : 'me';
  const [isAuthenticated] = useState(false);
  const { data } = useGetUserInfoQuery(id);
  const { reset } = useQueryErrorResetBoundary();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setReportBottomSheetOpen, setReportTarget } = useAuthActions();

  const handleDirectChatNav = useCallback(async () => {
    try {
      const chatRoomData = await getDirectChatRoom(id);
      const navParams: ChatParamList = {
        chatRoomId: chatRoomData.id,
        chatRoomName: chatRoomData.name ? chatRoomData.name : data?.username,
        isGroupChat: false,
      };
      navigation.navigate('채팅', {
        screen: 'ChatRoom',
        params: navParams,
      });
    } catch (e) {
      console.log('New chat Room has to be created');
      navigation.navigate('채팅', {
        screen: 'ChatRoom',
        params: {
          userId: data?.id,
          chatRoomName: data?.username,
          isGroupChat: false,
        },
      });
    }
  }, [data?.id, data?.username, id, navigation]);

  const renderError = useCallback(
    (resetErrorBoundary: () => void) => (
      <View style={style.errorContainer}>
        <Text>유저 정보를 불러올 수 없습니다.</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );

  return (
    <Suspense fallback={<GymInfoLoader />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) =>
          renderError(resetErrorBoundary)
        }>
        <SafeAreaView style={style.container}>
          {id === 'me' ? (
            <>
              <View style={style.myHeaderContainer}>
                <IconButton
                  icon="settings-outline"
                  onPress={() => {
                    navigation.navigate('Setting');
                  }}
                />
              </View>
              <Divider />
            </>
          ) : (
            <>
              <View style={style.otherHeaderContainer}>
                <IconButton
                  icon="chevron-back-outline"
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                {route.name === 'User' && (
                  <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                      <IconButton
                        icon="ellipsis-vertical"
                        onPress={() => {
                          setMenuVisible(true);
                        }}
                      />
                    }>
                    <Menu.Item
                      onPress={() => {
                        setReportTarget(route.name, route.params?.userId);
                        setReportBottomSheetOpen(true);
                        setMenuVisible(false);
                      }}
                      title="신고하기"
                    />
                    <Menu.Item
                      onPress={() => {
                        setIsModalOpen(true);
                        setMenuVisible(false);
                      }}
                      title="차단하기"
                    />
                  </Menu>
                )}
              </View>
              <Divider />
            </>
          )}
          <ScrollView
            style={style.container}
            contentContainerStyle={style.scrollViewContentContainer}>
            {/* 프로필 정보 */}
            <View style={style.profileContainer}>
              <View style={style.avatarContainer}>
                {data && (
                  <CustomAvatar
                    size={64}
                    profilePic={data?.profilePic}
                    username={data?.username}
                    style={style.avatar}
                  />
                )}
              </View>
              <View style={style.usernameContainer}>
                <Text variant="titleMedium">{data?.username} 님</Text>
                {isAuthenticated ? (
                  <Tooltip
                    title="프로필 인증이 완료된 회원입니다."
                    enterTouchDelay={100}>
                    <IconButton
                      icon="checkmark-circle-outline"
                      iconColor="green"
                      size={18}
                      style={style.icon}
                    />
                  </Tooltip>
                ) : null}
              </View>
              <View style={style.chatAndImageBtn}>
                {id === 'me' && data ? (
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (data) {
                        navigation.push('ProfileEdit', {
                          myInfo: data,
                        });
                      } else {
                        throw new Error('MyInfoData is undefined');
                      }
                    }}>
                    프로필 편집
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleDirectChatNav();
                    }}>
                    채팅하기
                  </Button>
                )}
              </View>
            </View>
            {/* 운동 목표 */}
            <View style={style.myGoalSection}>
              <View style={style.title}>
                <Text variant="titleMedium">🏃🏻‍♀️ 운동 목표</Text>
              </View>
              <ScrollView
                style={style.horizontalChipContainer}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}>
                {data &&
                data.workoutGoal &&
                data.workoutGoal.split(',').length > 0 ? (
                  data.workoutGoal.split(',').map((goal, index) => (
                    <Chip
                      elevated
                      elevation={1}
                      key={`workoutGoal-${index}`}
                      icon="checkmark-circle-outline"
                      style={[style.chip]}>
                      {goal}
                    </Chip>
                  ))
                ) : (
                  <Text variant="bodySmall">운동 목표를 등록해보세요!</Text>
                )}
              </ScrollView>
            </View>
            {/* 신체 정보 */}
            <View style={style.myBodySection}>
              <View style={style.title}>
                <Text variant="titleMedium">🏋🏻 피지컬</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  style.horizontalScrollViewContentContainer
                }
                style={style.physicalContainer}>
                <InfoCard textTitle="키" textContent={`${data?.height}cm`} />
                <InfoCard
                  textTitle="몸무게"
                  textContent={`${data?.weight}kg`}
                />
                <InfoCard
                  textTitle="운동 경력"
                  textContent={
                    data ? data.workoutLevel.split('(')[0] : '정보 없음'
                  }
                />
                <InfoCard
                  textTitle="나이"
                  textContent={data ? getAge(data.age) + '세' : '정보 없음'}
                />
                <InfoCard
                  textTitle="성별"
                  textContent={`${
                    data?.gender === 'male'
                      ? '남성'
                      : data?.gender === 'female'
                      ? '여성'
                      : '그 외'
                  }`}
                />
                {/* work out per week */}

                {/* TODO: 체지방률, 인바디, 분할 정보 등 다양한 신체 정보 추가 */}
              </ScrollView>
            </View>

            {/* 기타 개인 정보 */}
            <View style={style.myInfoSection}>
              <View style={style.title}>
                <Text variant="titleMedium">ℹ️ 정보</Text>
              </View>
              <View style={style.infoContainer}>
                <Card elevation={1}>
                  <Card.Content>
                    <List.Item
                      title="소개"
                      right={() => (
                        <Text variant="bodySmall">
                          {data?.bio ?? '자기 소개를 추가해보세요.'}
                        </Text>
                      )}
                    />
                    <List.Item
                      title="동네"
                      right={() => (
                        <Text variant="bodySmall">
                          {data?.city && data?.district
                            ? `${data.city} ${data.district}`
                            : '동네를 등록하고 친구를 찾아보세요!'}
                        </Text>
                      )}
                    />
                    {/* GymInfo는 nullable */}
                    {data?.gymInfo !== null ? (
                      <List.Item
                        title="헬스장"
                        right={() => (
                          <Text variant="bodySmall">
                            {data?.gymInfo?.name ??
                              '헬스장 정보를 불러 올 수 없습니다.'}
                          </Text>
                        )}
                      />
                    ) : (
                      <List.Item
                        title="헬스장"
                        right={() => (
                          <Text variant="bodySmall">
                            {'어떤 헬스장을 다니시나요?'}
                          </Text>
                        )}
                      />
                    )}

                    <List.Item
                      title="주당 운동"
                      right={() => (
                        <Text variant="bodySmall">{`${data?.workoutPerWeek}회`}</Text>
                      )}
                    />
                    <List.Item
                      title="활동 시간대"
                      right={() => (
                        <Text variant="bodySmall">
                          {data?.workoutTimePeriod}
                        </Text>
                      )}
                    />
                    <List.Item
                      title="일일 운동시간(강도)"
                      right={() => (
                        <Text variant="bodySmall">
                          {data?.workoutTimePerDay}
                        </Text>
                      )}
                    />
                  </Card.Content>
                </Card>
              </View>
            </View>
          </ScrollView>
          <UserBlockModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            userId={data?.id}
          />
        </SafeAreaView>
      </ErrorBoundary>
    </Suspense>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  otherHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {},
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: -40,
    top: -22,
  },
  title: {
    paddingLeft: 12,
  },
  physicalContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  infoContainer: {
    padding: 12,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: 50,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  horizontalChipContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 16,
  },
  myBodySection: {
    flex: 1,
    marginBottom: 16,
  },

  myGoalSection: {
    flex: 2,
    marginBottom: 16,
  },

  myInfoSection: {
    flex: 2,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  horizontalScrollViewContentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
  },
  chatAndImageBtn: {
    padding: 12,
  },
});
