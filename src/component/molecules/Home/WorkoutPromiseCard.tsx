import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Card } from 'react-native-paper';
import { WorkoutPromise } from '@/types';
const WorkoutPromiseCard = ({
  title,
  location,
  createdAt,
  promiseDate,
  gymName,
  currentNumberOfPeople,
  limitedNumberOfPeople,
  onPress,
}: WorkoutPromise) => {
  return (
    <View style={style.promiseCardContainer}>
      <Card onPress={onPress}>
        <Card.Title
          title={title}
          right={props => (
            <Text {...props} variant="bodySmall" style={style.subtitle}>
              {location} · {createdAt}
            </Text>
          )}
        />
        <Card.Content>
          <Text style={style.promiseInfo}>📅 {promiseDate}</Text>
          <Text style={style.promiseInfo}>📍 {gymName}</Text>
          <Text>
            👥 {currentNumberOfPeople}/{limitedNumberOfPeople} 참여
          </Text>
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
