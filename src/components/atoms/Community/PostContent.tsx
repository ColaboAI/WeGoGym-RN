import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  postId: number;
  communityId: number;
  content: string;
  onPress: ({
    postId,
    communityId,
  }: {
    postId: number;
    communityId: number;
  }) => void;
};

export default function PostContent({
  postId,
  content,
  communityId,
  onPress,
}: Props) {
  const [seeMore, setSeeMore] = useState(false);
  const isTextLong = content.length > 100;
  const contentToShow = seeMore ? content : content.slice(0, 100);
  const handlePress = () => {
    if (isTextLong && !seeMore) {
      setSeeMore(!seeMore);
      return;
    }
    if (isTextLong && seeMore) {
      onPress({ postId, communityId });
      return;
    }
    onPress({ postId, communityId });
  };

  return (
    <Pressable onPress={handlePress}>
      <Text style={styles.text} variant="bodyMedium">
        {contentToShow}
      </Text>
      {isTextLong && !seeMore && <Text variant="bodySmall">... 더보기</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'justify',
  },
});
