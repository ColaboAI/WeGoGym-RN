import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {
  IconButton,
  Text,
  Divider,
  Banner,
  useTheme,
} from 'react-native-paper';
import React, { useCallback, useState } from 'react';
import Profile from '@/component/molecules/Home/FriendProfileCard';
import WorkoutPromiseCard from '@/component/molecules/Home/WorkoutPromiseCard';
import { HomeStackScreenProps } from '@/navigators/types';
import CustomFAB from '@/component/molecules/Home/CustomFAB';
type HomeScreenProps = HomeStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  // TODO: PromiseCard ID를 parameter로.
  const navigateToPromiseDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  const friendData = [
    {
      id: 1,
      uri: 'https://i.ibb.co/Y725W4C/image.png',
      size: 80,
      username: '김강민',
    },
    {
      id: 2,
      uri: 'https://i.ibb.co/Y725W4C/image.png',
      size: 80,
      username: '장성엽',
    },
    {
      id: 3,
      uri: 'https://i.ibb.co/Y725W4C/image.png',
      size: 80,
      username: '강경원',
    },
  ];
  const promiseData = [
    {
      id: 1,
      title: '짐박스 봉천점에서 등 운동 하실 분',
      location: '신림동',
      createdAt: '3시간 전',
      promiseDate: '2023. 02. 09 오후 7시',
      gymName: '짐박스 봉천점',
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 3,
      uuid: '1',
    },
    {
      id: 2,
      title: '함서짐에서 어깨 운동',
      location: '구로동',
      createdAt: '5시간 전',
      promiseDate: '2023. 02. 01 오전 10시',
      gymName: '함서Gym',
      currentNumberOfPeople: 1,
      limitedNumberOfPeople: 2,
      uuid: '2',
    },
  ];
  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
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
      <ScrollView>
        <View style={style.title}>
          <Text
            variant="titleLarge"
            style={{
              color: theme.colors.primary,
            }}>
            👍🏻 추천 짐메이트
          </Text>
        </View>
        <View style={style.friendListContainer}>
          {friendData.map(item => (
            <Profile uri={item.uri} size={item.size} username={item.username} />
          ))}
        </View>
        <View style={style.title}>
          <Text
            variant="titleLarge"
            style={{
              color: theme.colors.primary,
            }}>
            💪🏻 같이 운동해요!
          </Text>
        </View>
        {promiseData.map(item => (
          <WorkoutPromiseCard
            title={item.title}
            location={item.location}
            createdAt={item.createdAt}
            promiseDate={item.promiseDate}
            gymName={item.gymName}
            currentNumberOfPeople={item.currentNumberOfPeople}
            limitedNumberOfPeople={item.limitedNumberOfPeople}
            onPress={navigateToPromiseDetails}
          />
        ))}
      </ScrollView>
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
});
