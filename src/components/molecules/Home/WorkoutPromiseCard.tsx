import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Card, useTheme, Divider } from 'react-native-paper';
import {
  getDday,
  getLocaleDate,
  getLocaleTime,
  getRelativeTime,
  isAcceptedParticipant,
  isRecruiting,
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
  promiseLocation,
  createdAt,
  workoutPart,
  participants,
  status,
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
        <>
          <Card
            mode="contained"
            style={{
              borderRadius: 0,
              backgroundColor: theme.colors.background,
            }}>
            <View style={style.hashTagContainer}>
              {isRecruiting(status) ? (
                <>
                  <View
                    style={[
                      style.tagBox,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}>
                    <Text style={style.tagText}>{getDday(promiseTime)}</Text>
                  </View>
                  {workoutPart && workoutPart.split(',').length > 0
                    ? workoutPart.split(',').map((part, index) => (
                        <View
                          key={`workout-promise-card-tag-${index}`}
                          style={[
                            style.tagBox,
                            {
                              backgroundColor: theme.colors.tertiaryContainer,
                            },
                          ]}>
                          <Text style={style.tagText}>{part}</Text>
                        </View>
                      ))
                    : null}
                </>
              ) : (
                <View
                  style={[
                    style.tagBox,
                    { backgroundColor: theme.colors.surfaceDisabled },
                  ]}>
                  <Text style={style.tagText}>모집 완료</Text>
                </View>
              )}
            </View>
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
                  <Text>
                    {promiseLocation ? promiseLocation.placeName : '위치 미정'}
                  </Text>
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
                    {getRelativeTime(createdAt)}
                  </Text>
                </View>
              </>
            </Card.Content>
          </Card>
          <Divider />
        </>
      ) : (
        <WorkoutPromiseLoader
          backgroundColor={theme.colors.background}
          foregroundColor={theme.colors.surfaceVariant}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  promiseCardContainer: {
    padding: 3,
  },
  hashTagContainer: {
    flexDirection: 'row',

    marginHorizontal: 12,
    marginTop: 6,
  },
  tagBox: {
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    paddingVertical: 5,
  },
  leftBox: {
    marginRight: 3,
    marginBottom: 5,
  },
  rightBox: { marginRight: 12, marginBottom: 5 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  icon: {
    marginRight: 6,
  },
});

export default WorkoutPromiseCard;
