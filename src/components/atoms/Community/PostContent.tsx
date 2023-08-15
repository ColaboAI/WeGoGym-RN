import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  postId: number;
  content: string;
  onPress: (id: number) => void;
};

export default function PostContent({ postId, content, onPress }: Props) {
  const [seeMore, setSeeMore] = useState(false);
  const isTextLong = content.length > 100;
  const contentToShow = seeMore ? content : content.slice(0, 100);
  const handlePress = () => {
    if (isTextLong && !seeMore) {
      setSeeMore(!seeMore);
      return;
    }
    if (isTextLong && seeMore) {
      onPress(postId);
      return;
    }
    onPress(postId);
  };

  return (
    <Pressable onPress={handlePress}>
      <Text variant="bodyMedium">{contentToShow}</Text>
      {isTextLong && !seeMore && <Text variant="bodySmall">... 더보기</Text>}
    </Pressable>
  );
}
