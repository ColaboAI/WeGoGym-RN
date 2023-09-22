import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  postId: number;
  content: string;
};

export default function PostDetailContent({ content }: Props) {
  return (
    <Text style={styles.text} variant="bodyMedium">
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'justify',
  },
});
