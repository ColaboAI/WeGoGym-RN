import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Button, Text } from 'react-native-paper';

type NotificationProps = {
  _id: string;
  title: string;
  message: string;
  onPressApprove: (id: string) => void;
  onPressReject: (id: string) => void;
  createdAt: string;
};

// 운동 약속 참여자 승인 및 거절
const NotificationCard = ({
  _id,
  title,
  message,
  onPressApprove,
  onPressReject,
}: NotificationProps) => {
  return (
    <Card>
      <Card.Title title={title} />
      <Card.Content>
        <Text>{message}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => {
            onPressApprove(_id);
          }}>
          승인
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => {
            onPressReject(_id);
          }}>
          거절
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default NotificationCard;
