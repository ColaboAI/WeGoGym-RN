import { Alert, StyleSheet, View } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
  Headline,
  Button,
} from 'react-native-paper';
import React, { Suspense, useCallback, useState } from 'react';
import WorkoutPromiseCard from 'components/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from 'navigators/types';
import CustomFAB from 'components/molecules/Home/CustomFAB';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import WorkoutPromiseLoader from 'components/molecules/Home/WorkoutPromiseLoader';
import ScreenWrapper from 'components/template/Common/ScreenWrapper';
import {
  useGetRecruitingWorkoutQuery,
  useGetWorkoutQuery,
} from '/hooks/queries/workout.queries';
import GymMateRecommendation from '/components/organisms/User/GymMateRecommend';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

type HomeScreenProps = HomeStackScreenProps<'Home'>;
// TODO:
// 추천 짐메이트의 경우 일단 백엔드 구현 없으므로. 추후에 구현.
// 페이지네이션 구현.(당겨서 새로고침?, 무한 스크롤)
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const { data: workoutPromiseList } = useGetWorkoutQuery(limit, offset);
  const { data: recruitingWorkoutPromiseList } = useGetRecruitingWorkoutQuery(
    limit,
    offset,
  );
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [visible, setVisible] = useState(true);

  const { reset } = useQueryErrorResetBoundary();

  const navigateToPromiseDetails = useCallback(
    (id: string) => {
      navigation.navigate('Details', { workoutPromiseId: id });
    },
    [navigation],
  );

  const navigateToUserDetails = useCallback(
    (id: string) => {
      navigation.navigate('User', { userId: id });
    },
    [navigation],
  );

  const renderBanner = useCallback(
    () =>
      visible ? (
        <View style={style.bannerContainer}>
          <Banner
            elevation={4}
            visible={visible}
            actions={[
              {
                label: '닫기',
                onPress: () => setVisible(false),
              },
            ]}
            contentStyle={style.banner}>
            🎉 2023년 3월 1일부터 위고짐 서비스를 시작합니다. 🎉
          </Banner>
        </View>
      ) : null,
    [visible],
  );

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
            <View>
              {workoutPromiseList && recruitingWorkoutPromiseList ? (
                <FlatList
                  data={
                    isCheck
                      ? workoutPromiseList.items
                      : recruitingWorkoutPromiseList.items
                  }
                  keyExtractor={item => item.id.toString()}
                  contentContainerStyle={style.workoutPromiseContainer}
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
                />
              ) : (
                <WorkoutPromiseLoader />
              )}
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
});
