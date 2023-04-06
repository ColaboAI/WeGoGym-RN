import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { usePutNotificationMutation } from '/hooks/queries/notification.queries';
import {
  usePutWorkoutParticipantAcceptMutation,
  // usePutWorkoutParticipantRejectMutation,
} from '/hooks/queries/workout.queries';
import { getNotificationBody, getRelativeTime } from '/utils/util';

type NotificationProps = {
  id: string;
  message: string;
  readAt: Date | null;
  notificationType: string;
  sender: WorkoutParticipantsRead;
  recipient: WorkoutParticipantsRead;
  createdAt: Date;
  navigateToUserDetails: (id: string) => void;
  navigateToWorkoutDetails: (id: string) => void;
};

// 운동 약속 참여자 승인 및 거절
const NotificationCard = ({
  id,
  message,
  readAt,
  notificationType,
  sender,
  recipient,
  createdAt,
  navigateToUserDetails,
  navigateToWorkoutDetails,
}: NotificationProps) => {
  const theme = useTheme();
  const body = getNotificationBody(notificationType);
  const updateWorkoutParticipantAcceptMutation =
    usePutWorkoutParticipantAcceptMutation();
  // const updateWorkoutParticipantRejectMutation =
  //   usePutWorkoutParticipantRejectMutation();
  const updateNotificationMutation = usePutNotificationMutation();

  const onPressAccept = useCallback(async () => {
    const data = {
      workoutPromiseId: recipient.workoutPromiseId,
      userId: sender.userId,
      workoutParticipant: {
        status: 'ACCEPTED',
      },
    };
    updateWorkoutParticipantAcceptMutation.mutate(data);
    updateNotificationMutation.mutate({ notificationId: id });
  }, [
    id,
    recipient.workoutPromiseId,
    sender.userId,
    updateNotificationMutation,
    updateWorkoutParticipantAcceptMutation,
  ]);

  // const onPressReject = useCallback(async () => {
  //   const data = {
  //     workoutPromiseId: recipient.workoutPromiseId,
  //     userId: sender.userId,
  //     workoutParticipant: {
  //       status: 'REJECTED',
  //     },
  //   };
  //   updateWorkoutParticipantRejectMutation.mutate(data);
  //   updateNotificationMutation.mutate({ notificationId: id });
  // }, [
  //   recipient.workoutPromiseId,
  //   sender.userId,
  //   updateWorkoutParticipantRejectMutation,
  //   updateNotificationMutation,
  //   id,
  // ]);

  const renderButton = () => {
    if (notificationType === 'WORKOUT_REQUEST') {
      if (!readAt) {
        return (
          <>
            <Pressable onPress={onPressAccept}>
              <View
                style={[
                  styles.buttonBox,
                  { backgroundColor: theme.colors.primary },
                ]}>
                <Text
                  variant="titleSmall"
                  style={[
                    styles.buttonText,
                    { color: theme.colors.onPrimary },
                  ]}>
                  승인
                </Text>
              </View>
            </Pressable>
            {/* <Pressable onPress={onPressReject}>
              <View
                style={[
                  styles.buttonBox,
                  { backgroundColor: theme.colors.errorContainer },
                ]}>
                <Text
                  variant="titleSmall"
                  style={[styles.buttonText, { color: theme.colors.error }]}>
                  거절
                </Text>
              </View>
            </Pressable> */}
          </>
        );
      } else {
        return (
          <Pressable disabled={true}>
            <View
              style={[
                styles.buttonBox,
                { backgroundColor: theme.colors.secondary },
              ]}>
              <Text
                variant="titleSmall"
                style={[
                  styles.buttonText,
                  { color: theme.colors.onSecondary },
                ]}>
                완료됨
              </Text>
            </View>
          </Pressable>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <Pressable
      onPress={() => navigateToWorkoutDetails(recipient.workoutPromiseId)}>
      <View key={`notification-${id}`} style={styles.notificationCardContainer}>
        <Card
          mode="contained"
          style={{ borderRadius: 0, backgroundColor: theme.colors.background }}>
          <Card.Content>
            <>
              <View style={styles.infoContainer}>
                <View style={styles.avatarContainer}>
                  <Pressable
                    onPress={() => {
                      navigateToUserDetails(sender.userId);
                    }}>
                    <CustomAvatar
                      size={30}
                      profilePic={sender.user.profilePic}
                      username={sender.user.username}
                    />
                  </Pressable>
                </View>
                <View style={styles.messsageContainer}>
                  <Text variant="titleSmall">
                    <Text style={styles.username}>{sender.user.username}</Text>
                    님{body} {message}{' '}
                    <Text
                      variant="titleSmall"
                      style={{ color: theme.colors.onBackground }}>
                      {getRelativeTime(createdAt)}
                    </Text>
                  </Text>
                </View>
                <View style={styles.buttonContainer}>{renderButton()}</View>
              </View>
            </>
          </Card.Content>
        </Card>
        <Divider />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  notificationCardContainer: {
    padding: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
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
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '500',
  },
});

export default NotificationCard;
