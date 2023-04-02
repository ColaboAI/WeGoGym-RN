import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Card, useTheme } from 'react-native-paper';
import {
  getLocaleDate,
  getLocaleTime,
  getRelativeTime,
  isAcceptedParticipant,
} from 'utils/util';
import WorkoutPromiseLoader from './WorkoutPromiseLoader';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';

const WorkoutPromiseCard = ({
  id,
  title,
  adminUserId,
  maxParticipants,
  promiseTime,
  gymInfo,
  updatedAt,
  participants,
}: WorkoutPromiseRead) => {
  // admin user 탈퇴 대응
  const adminPar = participants.find(
    participant => participant.userId === adminUserId,
  );

  const adminUserInfo = adminPar?.user;

  const theme = useTheme();
  return (
    <View key={`workout-promise-card-${id}`} style={style.promiseCardContainer}>
      {adminUserInfo ? (
        <Card elevation={1}>
          <Card.Title
            title={title}
            left={props => (
              <CustomAvatar
                {...props}
                size={30}
                profilePic={adminUserInfo?.profilePic}
                username={adminUserInfo?.username ?? '알 수 없음'}
              />
            )}
            right={props => (
              <Text {...props} variant="labelSmall">
                {adminUserInfo?.username ?? '알 수 없음'}님
              </Text>
            )}
            leftStyle={style.leftBox}
            rightStyle={style.rightBox}
          />
          <Card.Content>
            <>
              <View style={style.infoBox}>
                <Icon
                  name="calendar-outline"
                  size={18}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text>
                  {getLocaleDate(promiseTime)} {getLocaleTime(promiseTime)}
                </Text>
              </View>
              <View style={style.infoBox}>
                <Icon
                  name="location-outline"
                  size={18}
                  color={theme.colors.onBackground}
                  style={style.icon}
                />
                <Text>{gymInfo ? gymInfo.name : '위치 미정'}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={style.infoBox}>
                  <Icon
                    name="people-outline"
                    size={18}
                    color={theme.colors.onBackground}
                    style={style.icon}
                  />
                  <Text>
                    {isAcceptedParticipant(participants).length}/
                    {maxParticipants} 참여 중
                  </Text>
                </View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onBackground }}>
                  {getRelativeTime(updatedAt)}
                </Text>
              </View>
            </>
          </Card.Content>
        </Card>
      ) : (
        <WorkoutPromiseLoader />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  promiseCardContainer: {
    padding: 12,
  },
  leftBox: {
    marginRight: 0,
    marginBottom: 5,
  },
  rightBox: { marginRight: 12, marginBottom: 5 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
  },
});

export default WorkoutPromiseCard;
