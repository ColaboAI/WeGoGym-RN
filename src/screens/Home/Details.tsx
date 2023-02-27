import { StyleSheet, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HomeStackScreenProps } from 'navigators/types';
import { useRoute } from '@react-navigation/native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { getLocaleDate, getLocaleTime } from 'utils/util';
import { getWorkoutPromise } from 'api/api';
type HomeScreenProps = HomeStackScreenProps<'Home'>;

export default function DetailsScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [workoutPromise, setWorkoutPromise] =
    useState<WorkoutPromiseRead | null>(null);

  // TODO: 운동 약속 id props로 전달 받아서 react-query로 운동 약속 상세 정보 불러오기

  // TODO: 정보 불러오기 전까지 skeleton-view 표시


  return (
    <ScrollView style={style.container}>
      <View style={style.title}>
        <Chip style={style.chip}>모집 중</Chip>
        <Text
          variant="headlineLarge"
          style={{
            color: theme.colors.primary,
            fontSize: 20,
            fontWeight: '600',
          }}>
          짐박스에서 운동하실 분
        </Text>
      </View>
      <View style={style.workoutPromiseInfo}>
        <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
          📅 
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
          📍 
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
          👥 /
           참여
        </Text>
        <Text variant="bodyLarge" style={{ marginBottom: 6 }}>
          내용
        </Text>
        <View style={style.participant}>
          <Text variant="labelLarge">
            참여중인 짐메이트 1/
            5
          </Text>
          {/* // TODO: 프로필 사진 */}
        </View>
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  chip: {
    marginRight: 12,
  },
  workoutPromiseInfo: { marginBottom: 12, marginHorizontal: 12 },
  participant: {},
});
