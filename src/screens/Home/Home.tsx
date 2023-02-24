import { StyleSheet, View } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
} from 'react-native-paper';
import React, { Suspense, useCallback, useState } from 'react';
import WorkoutPromiseCard from 'components/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from 'navigators/types';
import CustomFAB from 'components/molecules/Home/CustomFAB';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import WorkoutPromiseLoader from 'components/molecules/Home/WorkoutPromiseLoader';
import ScreenWrapper from 'components/template/Common/ScreenWrapper';
import { useGetWorkoutQuery } from '/hooks/queries/workout.queries';
type HomeScreenProps = HomeStackScreenProps<'Home'>;
// TODO:
// 추천 짐메이트의 경우 일단 백엔드 구현 없으므로. 추후에 구현.
// 페이지네이션 구현.(당겨서 새로고침?, 무한 스크롤)
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(1);

  const query = useGetWorkoutQuery(limit, offset);
  const [visible, setVisible] = useState(true);
  // TODO: PromiseCard ID를 parameter로.
  const navigateToPromiseDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  // const renderGymMateRecommendation = useCallback(() => {
  //   return (
  //     <>
  //       <View style={style.title}>
  //         <Text
  //           variant="titleLarge"
  //           style={[
  //             style.font,
  //             {
  //               color: theme.colors.primary,
  //             },
  //           ]}>
  //           👍🏻 추천 짐메이트
  //         </Text>
  //       </View>
  //       <View style={style.friendListContainer}>
  //         {friendList ? (
  //           friendList.map(friend => (
  //             <FriendProfileCard
  //               key={`User-Reco-${friend._id}`}
  //               _id={friend._id}
  //               phoneNumber={friend.phoneNumber}
  //               profilePic={friend.profilePic}
  //               username={friend.username}
  //               gender={friend.gender}
  //               age={friend.age}
  //               height={friend.height}
  //               weight={friend.weight}
  //               workoutPerWeek={friend.workoutPerWeek}
  //               workoutTimePeriod={friend.workoutTimePeriod}
  //               workoutTimePerDay={friend.workoutTimePerDay}
  //               workoutLevel={friend.workoutLevel}
  //               workoutGoal={friend.workoutGoal}
  //             />
  //           ))
  //         ) : (
  //           <FriendListLoader />
  //         )}
  //       </View>
  //       <View style={style.title}>
  //         <Text
  //           variant="titleLarge"
  //           style={{
  //             color: theme.colors.primary,
  //             fontSize: 20,
  //             fontWeight: '600',
  //           }}>
  //           💪🏻 같이 운동해요!
  //         </Text>
  //       </View>
  //     </>
  //   );
  // }, [friendList, theme.colors.primary]);

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
          <IconButton
            icon="notifications-outline"
            onPress={() => {
              navigation.navigate('Notifications');
            }}
          />
        </View>
        <Divider />
        {renderBanner()}
        <View style={style.title}>
          <Text
            variant="titleLarge"
            style={{
              color: theme.colors.primary,
              fontSize: 20,
              fontWeight: '600',
            }}>
            💪🏻 같이 운동해요!
          </Text>
        </View>
        <Suspense fallback={<WorkoutPromiseLoader />}>
          <View>
            {query.data ? (
              <FlatList
                data={query.data.items}
                keyExtractor={item => item.id}
                contentContainerStyle={style.workoutPromiseContainer}
                initialNumToRender={5}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={`work-promise-container-${item.id}`}
                    onPress={navigateToPromiseDetails}>
                    <WorkoutPromiseCard
                      key={`work-promise-${item.id}`}
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
