import { Text } from 'react-native-paper';
import React from 'react';

type Props = {
  userId: string;
};

const UserId = ({ userId }: Props) => {
  return <Text>{userId}</Text>;
};

export default UserId;
