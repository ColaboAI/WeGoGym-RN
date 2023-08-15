import React from 'react';
import { Text } from 'react-native-paper';

type Props = {
  postId: number;
  content: string;
};

export default function PostDetailContent({ content }: Props) {
  return <Text variant="bodyMedium">{content}</Text>;
}
