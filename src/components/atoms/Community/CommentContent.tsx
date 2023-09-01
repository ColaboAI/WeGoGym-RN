import React from 'react';
import { Text } from 'react-native-paper';

type Props = {
  content: string;
};

export default function CommentContent({ content }: Props) {
  return <Text variant="bodyMedium">{content}</Text>;
}
