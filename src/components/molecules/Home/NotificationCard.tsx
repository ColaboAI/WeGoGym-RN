import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Button, Text, useTheme } from 'react-native-paper';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import {
  usePutWorkoutParticipantAcceptMutation,
  usePutWorkoutParticipantRejectMutation,
} from '/hooks/queries/workout.queries';
import { getNotificationBody, getRelativeTime } from '/utils/util';

type NotificationProps = {
  id: string;
  message: string;
  readAt: Date | null;
  // 알림 타입에 따라 보여줄 컴포넌트가 달라짐
  notificationType: string;
  sender: WorkoutParticipantsRead;
  recipient: WorkoutParticipantsRead;
  createdAt: Date;
  navigateToUserDetails: (id: string) => void;
};

// 운동 약속 참여자 승인 및 거절
const NotificationCard = ({
  id,
  message,
  // readAt,
  notificationType,
  sender,
  recipient,
  createdAt,
  navigateToUserDetails,
}: NotificationProps) => {
  const theme = useTheme();
  const body = getNotificationBody(notificationType);
  const updateWorkoutParticipantAcceptMutation =
    usePutWorkoutParticipantAcceptMutation();
  const updateWorkoutParticipantRejectMutation =
    usePutWorkoutParticipantRejectMutation();

  const onPressAccept = useCallback(async () => {
    const data = {
      workoutPromiseId: recipient.workoutPromiseId,
      userId: sender.userId,
      workoutParticipant: {
        name: sender.user.username,
        message,
        status: 'ACCEPTED',
      },
    };
    updateWorkoutParticipantAcceptMutation.mutate(data);
  }, [
    recipient.workoutPromiseId,
    sender.userId,
    sender.user.username,
    message,
    updateWorkoutParticipantAcceptMutation,
  ]);

  const onPressReject = useCallback(async () => {
    const data = {
      workoutPromiseId: recipient.workoutPromiseId,
      userId: sender.userId,
      workoutParticipant: {
        status: 'REJECTED',
      },
    };
    updateWorkoutParticipantRejectMutation.mutate(data);
  }, [
    updateWorkoutParticipantRejectMutation,
    recipient.workoutPromiseId,
    sender.userId,
  ]);

  return (
    <View key={`notification-${id}`} style={styles.notificationCardContainer}>
      <Card>
        <Card.Content>
          <>
            <View style={styles.infoContainer}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigateToUserDetails(sender.id);
                  }}>
                  <CustomAvatar
                    size={30}
                    profilePic={sender.user.profilePic}
                    username={sender.user.username}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.messsageContainer}>
                <Text variant="titleSmall">
                  <Text style={styles.username}>{sender.user.username}</Text>님
                  {body} {message}{' '}
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onPrimaryContainer }}>
                    {getRelativeTime(createdAt)}
                  </Text>
                </Text>
              </View>
            </View>
          </>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={onPressAccept}>
            승인
          </Button>
          <Button mode="contained-tonal" onPress={onPressReject}>
            거절
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationCardContainer: {
    paddingVertical: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  username: {
    fontWeight: '700',
  },
  messsageContainer: {
    flex: 1,
    flexGrow: 1,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NotificationCard;
