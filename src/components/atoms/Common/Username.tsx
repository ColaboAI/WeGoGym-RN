import React from 'react';
import { Text } from 'react-native-paper';

type Props = {
  username: string;
};

const Username = ({ username }: Props) => {
  return (
    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
      {username}
    </Text>
  );
};

export default Username;
