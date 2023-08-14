import React from 'react';
import { Text } from 'react-native-paper';
import { getRelativeTime } from '/utils/util';
type Props = {
  date: Date;
};

const RelativeTime = ({ date }: Props) => {
  return <Text variant="labelSmall"> · {getRelativeTime(date)}</Text>;
};

export default RelativeTime;
