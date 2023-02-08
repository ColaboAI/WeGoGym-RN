import { StyleSheet, View, SafeAreaView } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
} from 'react-native-paper';
import React, { useCallback, useEffect, useState } from 'react';
import FriendProfileCard from '@/component/molecules/Home/FriendProfileCard';
import WorkoutPromiseCard from '@/component/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from '@/navigators/types';
import CustomFAB from '@/component/molecules/Home/CustomFAB';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { getFriendList, getWorkoutPromise } from '@/api/api';
import { UserCreate, WorkoutPromiseCreate } from '@/types';
import WorkoutPromiseLoader from '@/component/molecules/Home/WorkoutPromiseLoader';
import FriendListLoader from '@/component/molecules/Home/FriendListLoader';
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

  return (
    <SafeAreaView style={style.container}>
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
      <View style={style.bannerContainer}>
        <Banner
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
              _id={friend._id}
              phone_number={friend.phone_number}
              uri={friend.uri}
              username={friend.username}
              gender={friend.gender}
              age={friend.age}
              height={friend.height}
              weight={friend.weight}
              workout_per_week={friend.workout_per_week}
              workout_time={friend.workout_time}
              workout_time_how_long={friend.workout_time_how_long}
              workout_level={friend.workout_level}
              workout_goal={friend.workout_goal}
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
      <View>
        {workoutPromise ? (
          <FlatList
            data={workoutPromise}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={navigateToPromiseDetails}>
                <WorkoutPromiseCard
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
            disableVirtualization={false}
          />
        ) : (
          <WorkoutPromiseLoader />
        )}
      </View>
      <CustomFAB
        icon="barbell-outline"
        onPress={() => {
          navigation.navigate('Posting');
        }}
      />
    </SafeAreaView>
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
});
