import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Card } from 'react-native-paper';
import { getLocaleDate, getLocaleTime } from 'utils/util';

const WorkoutPromiseCard = ({
  user,
  title,
  location,
  date,
  time,
  currentNumberOfPeople,
  limitedNumberOfPeople,
  createdAt,
}: WorkoutPromiseCreate) => {
  return (
    <View style={style.promiseCardContainer}>
      <Card>
        <Card.Title
          title={title}
          right={props => (
            <Text {...props} variant="bodySmall" style={style.subtitle}>
              {user.username}님 ∙ {createdAt.getHours()}시간 전
            </Text>
          )}
        />
        <Card.Content>
          <>
            <Text style={style.promiseInfo}>
              📅 {getLocaleDate(date)} {getLocaleTime(time)}
            </Text>
            <Text style={style.promiseInfo}>📍 {location}</Text>
            <Text>
              👥 {currentNumberOfPeople}/{limitedNumberOfPeople} 참여
            </Text>
          </>
        </Card.Content>
      </Card>
    </View>
  );
};

const style = StyleSheet.create({
  promiseCardContainer: {
    padding: 12,
  },
  subtitle: { marginRight: 12 },
  promiseInfo: { marginBottom: 6 },
});

export default WorkoutPromiseCard;
