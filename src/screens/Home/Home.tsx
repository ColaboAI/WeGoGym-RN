import { StyleSheet, View } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import React, { Suspense, useCallback, useState } from 'react';
import WorkoutPromiseCard from 'components/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from 'navigators/types';
import CustomFAB from 'components/molecules/Home/CustomFAB';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import WorkoutPromiseLoader from 'components/molecules/Home/WorkoutPromiseLoader';
import ScreenWrapper from 'components/template/Common/ScreenWrapper';
import {
  useGetRecruitingWorkoutQuery,
  useGetWorkoutQuery,
} from '/hooks/queries/workout.queries';
import GymMateRecommendation from '/components/organisms/User/GymMateRecommend';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { getValueFor, save } from '/store/secureStore';

type HomeScreenProps = HomeStackScreenProps<'Home'>;
// TODO:
// 페이지네이션 구현 (당겨서 새로고침)
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const {
    data: workoutPromiseList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useGetWorkoutQuery();

  const {
    data: recruitingWorkoutPromiseList,
    fetchNextPage: fetchNextRecruitingWorkoutPage,
    isFetchingNextPage: isFetchingNextRecruitingWorkoutPage,
    hasNextPage: hasNextRecruitingWorkoutPage,
    refetch: refetchRecruitingWorkout,
  } = useGetRecruitingWorkoutQuery();

  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [visible, setVisible] = useState<string | null>(
    getValueFor('isFirstTime'),
  );
  const { reset } = useQueryErrorResetBoundary();
  const [refreshing, setRefreshing] = useState(false);

  const navigateToPromiseDetails = useCallback(
    (id: string) => {
      navigation.navigate('Details', { workoutPromiseId: id });
    },
    [navigation],
  );

  const navigateToUserDetails = useCallback(
    (id: string) => {
      navigation.push('User', { userId: id });
    },
    [navigation],
  );

  const renderBanner = useCallback(
    () => (
      <View style={style.bannerContainer}>
        <Banner
          elevation={4}
          visible={visible === 'false' ? false : true}
          actions={[
            {
              label: '닫기',
              onPress: () => {
                save('isFirstTime', 'false');
                setVisible('false');
              },
            },
          ]}
          contentStyle={style.banner}>
          🎉 2023년 3월 1일부터 위고짐 서비스를 시작합니다. 🎉
        </Banner>
      </View>
    ),
    [visible],
  );

  const renderError = useCallback(
    (resetErrorBoundary: () => void) => (
      <View style={style.errorContainer}>
        <Text>운동을 불러올 수 없습니다!</Text>
        <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: WorkoutPromiseRead }) => (
      <TouchableOpacity
        key={`workout-promise-container-${item.id}`}
        onPress={() => {
          navigateToPromiseDetails(item.id);
        }}>
        <WorkoutPromiseCard key={`workout-promise-${item.id}`} {...item} />
      </TouchableOpacity>
    ),
    [navigateToPromiseDetails],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isCheck) {
      refetchRecruitingWorkout();
    } else {
      refetch();
    }
    setRefreshing(false);
  }, [isCheck, refetch, refetchRecruitingWorkout]);

  return (
    <>
      <ScreenWrapper withScrollView={false} style={style.container}>
        <View style={style.headerContainer}>
          <Text
            variant="titleLarge"
            style={[
              style.font,
              {
                color: theme.colors.primary,
              },
            ]}>
            WeGoGym
          </Text>
          <View style={style.iconContainer}>
            <IconButton
              icon="document-text-outline"
              onPress={() => {
                navigation.navigate('MyWorkoutPromises');
              }}
            />
            <IconButton
              icon="notifications-outline"
              onPress={() => {
                navigation.navigate('Notifications');
              }}
            />
          </View>
        </View>
        <Divider />
        {renderBanner()}
        <Suspense fallback={<WorkoutPromiseLoader />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) =>
              renderError(resetErrorBoundary)
            }>
            <View>
              <FlatList
                data={
                  !isCheck
                    ? workoutPromiseList?.pages.flatMap(page => page.items)
                    : recruitingWorkoutPromiseList?.pages.flatMap(
                        page => page.items,
                      )
                }
                keyExtractor={item => item.id}
                contentContainerStyle={style.workoutPromiseContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={() => {
                  if (!isCheck) {
                    if (hasNextPage) {
                      fetchNextPage();
                    }
                    console.log('end reached');
                  } else {
                    if (hasNextRecruitingWorkoutPage) {
                      fetchNextRecruitingWorkoutPage();
                    }
                    console.log('end reached');
                  }
                }}
                onEndReachedThreshold={0.1}
                initialNumToRender={5}
                ListHeaderComponent={
                  <>
                    <GymMateRecommendation
                      navigateToUserDetails={navigateToUserDetails}
                    />
                    <View style={style.isRecruitingContainer}>
                      <IconButton
                        icon={
                          isCheck
                            ? 'checkmark-circle-outline'
                            : 'ellipse-outline'
                        }
                        size={20}
                        onPress={() => {
                          setIsCheck(!isCheck);
                        }}
                      />
                      <Text variant="titleSmall">
                        모집중인 운동 약속만 보기
                      </Text>
                    </View>
                  </>
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  <ActivityIndicator
                    animating={
                      !isCheck
                        ? isFetchingNextPage
                        : isFetchingNextRecruitingWorkoutPage
                    }
                  />
                }
                ListEmptyComponent={
                  <View style={style.emptyContainer}>
                    <Text>
                      운동 약속이 없습니다. 새로운 운동 약속을 만들어보세요!
                    </Text>
                  </View>
                }
              />
            </View>
          </ErrorBoundary>
        </Suspense>
      </ScreenWrapper>
      <CustomFAB
        icon="barbell-outline"
        onPress={() => {
          navigation.navigate('Posting');
        }}
      />
    </>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  isRecruitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bannerContainer: {
    justifyContent: 'center',
  },
  banner: {
    shadowColor: 'transparent',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: 12,
  },
  friendListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 6,
  },
  font: {
    fontSize: 20,
    fontWeight: '600',
  },
  workoutPromiseContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
