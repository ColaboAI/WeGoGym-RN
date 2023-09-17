import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
  postId: number;
  communityId: number;
  // summary: string;
  content: string;
  onPress: ({
    postId,
    communityId,
  }: {
    postId: number;
    communityId: number;
  }) => void;
};

const PostAiSummary = ({
  postId,
  communityId,
  // summary,
  content,
  onPress,
}: Props) => {
  const theme = useTheme();
  const [seeMore, setSeeMore] = useState(false);
  const isTextLong = content.length > 25;
  const contentToShow = seeMore ? content : content.slice(0, 25);
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
    <View
      style={[
        styles.container,
        {
          alignItems: seeMore ? 'flex-start' : 'center',
        },
      ]}>
      <View
        style={[
          styles.chipBox,
          { backgroundColor: theme.colors.tertiaryContainer },
        ]}>
        <Text style={styles.chipText}>✨ AI 요약</Text>
      </View>
      <Pressable style={styles.summaryBox} onPress={handlePress}>
        <Text
          style={[
            styles.summaryText,
            {
              color: theme.colors.onBackground,
            },
          ]}>
          {contentToShow}
        </Text>
        {isTextLong && !seeMore && (
          <Text style={styles.seeMoreText}>... 더보기</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: '2%',
  },
  chipBox: {
    borderRadius: 5,
    paddingHorizontal: '2%',
    marginRight: '2%',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  summaryBox: {
    flex: 1,
    flexDirection: 'column',
    marginRight: '2%',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  seeMoreText: {
    fontSize: 10,
  },
});

export default PostAiSummary;
