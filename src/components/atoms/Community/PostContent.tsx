import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  content: string;
};

export default function PostContent({ content }: Props) {
  const [seeMore, setSeeMore] = useState(false);
  const isTextLong = content.length > 100;
  const contentToShow = seeMore ? content : content.slice(0, 100);

  return (
    <Pressable onPress={() => setSeeMore(prev => !prev)}>
      <Text variant="bodySmall">{contentToShow}</Text>
      {isTextLong && !seeMore && <Text variant="bodySmall">... 더보기</Text>}
    </Pressable>
  );
}
