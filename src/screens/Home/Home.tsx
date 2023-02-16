import { StyleSheet, View } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
} from 'react-native-paper';
import React, { useCallback, useEffect, useState } from 'react';
import FriendProfileCard from 'components/molecules/Home/FriendProfileCard';
import WorkoutPromiseCard from 'components/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from 'navigators/types';
import CustomFAB from 'components/molecules/Home/CustomFAB';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { getFriendList, getWorkoutPromise } from 'api/api';
import WorkoutPromiseLoader from 'components/molecules/Home/WorkoutPromiseLoader';
import FriendListLoader from 'components/molecules/Home/FriendListLoader';
import ScreenWrapper from 'components/template/Common/ScreenWrapper';
type HomeScreenProps = HomeStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const [friendList, setFriendList] = useState<UserCreate[] | null>(null);
  const [workoutPromise, setWorkoutPromise] = useState<
    WorkoutPromiseCreate[] | null
  >(null);
  // TODO: PromiseCard ID를 parameter로.
  const navigateToPromiseDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await getFriendList();
      const workoutPromiseData = await getWorkoutPromise();
      setFriendList(friendData);
      setWorkoutPromise(workoutPromiseData);
    };
    fetchData();
  }, []);

  const renderGymMateRecommendation = useCallback(() => {
    return (
      <>
        <View style={style.title}>
          <Text
            variant="titleLarge"
            style={[
              style.font,
              {
                color: theme.colors.primary,
              },
            ]}>
            👍🏻 추천 짐메이트
          </Text>
        </View>
        <View style={style.friendListContainer}>
          {friendList ? (
            friendList.map(friend => (
              <FriendProfileCard
                key={`User-Reco-${friend._id}`}
                _id={friend._id}
                phoneNumber={friend.phoneNumber}
                profilePic={friend.profilePic}
                username={friend.username}
                gender={friend.gender}
                age={friend.age}
                height={friend.height}
                weight={friend.weight}
                workoutPerWeek={friend.workoutPerWeek}
                workoutTimePeriod={friend.workoutTimePeriod}
                workoutTimePerDay={friend.workoutTimePerDay}
                workoutLevel={friend.workoutLevel}
                workoutGoal={friend.workoutGoal}
              />
            ))
          ) : (
            <FriendListLoader />
          )}
        </View>
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
      </>
    );
  }, [friendList, theme.colors.primary]);

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
        <View>
          {workoutPromise ? (
            <FlatList
              data={workoutPromise}
              keyExtractor={item => item._id}
              contentContainerStyle={style.workoutPromiseContainer}
              ListHeaderComponent={renderGymMateRecommendation}
              initialNumToRender={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={`work-promise-container-${item._id}`}
                  onPress={navigateToPromiseDetails}>
                  <WorkoutPromiseCard
                    key={`work-promise-${item._id}`}
                    _id={item._id}
                    user={item.user}
                    title={item.title}
                    description={item.description}
                    location={item.location}
                    date={item.date}
                    time={item.time}
                    currentNumberOfPeople={item.currentNumberOfPeople}
                    limitedNumberOfPeople={item.limitedNumberOfPeople}
                    createdAt={item.createdAt}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <WorkoutPromiseLoader />
          )}
        </View>
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
