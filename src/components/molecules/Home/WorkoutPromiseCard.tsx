import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Card } from 'react-native-paper';
import { getLocaleDate, getLocaleTime, getRelativeTime } from 'utils/util';

const WorkoutPromiseCard = ({
  id,
  title,
  // description,
  maxParticipants,
  promiseTime,
  // recruitEndTime,
  gymInfo,
  updatedAt,
  participants,
}: WorkoutPromiseRead) => {
  return (
    <View key={`workout-promise-card-${id}`} style={style.promiseCardContainer}>
      <Card>
        <Card.Title
          title={title}
          right={props => (
            <Text {...props} variant="bodySmall" style={style.subtitle}>
              익명님 ∙ {getRelativeTime(updatedAt)}
            </Text>
          )}
        />
        <Card.Content>
          <>
            <Text style={style.promiseInfo}>
              📅 {getLocaleDate(promiseTime)} {getLocaleTime(promiseTime)}
            </Text>
            <Text style={style.promiseInfo}>
              📍 {gymInfo ? gymInfo.name : '위치 미정'}
            </Text>
            <Text>
              👥 {participants.length}/{maxParticipants} 참여
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
