import { StyleSheet, View } from 'react-native';
import React, { Suspense } from 'react';
import { Text, Card } from 'react-native-paper';
import {
  getLocaleDate,
  getLocaleTime,
  getRelativeTime,
  isAcceptedParticipant,
} from 'utils/util';
import { useGetUserInfoQuery } from '/hooks/queries/user.queries';
import WorkoutPromiseLoader from './WorkoutPromiseLoader';

const WorkoutPromiseCard = ({
  id,
  title,
  adminUserId,
  // description,
  maxParticipants,
  promiseTime,
  // recruitEndTime,
  gymInfo,
  updatedAt,
  participants,
}: WorkoutPromiseRead) => {
  const { data: adminUserInfo } = useGetUserInfoQuery(adminUserId);

  return (
    <Suspense fallback={<WorkoutPromiseLoader />}>
      <View
        key={`workout-promise-card-${id}`}
        style={style.promiseCardContainer}>
        <Card>
          <Card.Title
            title={title}
            right={props => (
              <Text {...props} variant="bodySmall" style={style.subtitle}>
                {adminUserInfo?.username}님 ∙ {getRelativeTime(updatedAt)}
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
                👥 {isAcceptedParticipant(participants)}/{maxParticipants} 참여
              </Text>
            </>
          </Card.Content>
        </Card>
      </View>
    </Suspense>
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
