import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { IconButton, Text, Divider, useTheme } from 'react-native-paper';
import React from 'react';
import Profile from '@/component/molecules/Home/FriendProfileCard';

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const data = [
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
  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <IconButton
          icon="notifications-outline"
          onPress={() => {
            navigation.navigate('Notifications');
          }}
        />
      </View>
      <Divider />
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
          {data.map(item => (
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
      </ScrollView>
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
    justifyContent: 'flex-end',
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
