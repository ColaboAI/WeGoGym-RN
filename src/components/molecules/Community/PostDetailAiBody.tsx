import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
  // aiCoaching: AiCoachingRead;
  post: PostRead;
};

const PostDetailAiBody = ({
  // aiCoaching,
  post,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.chipBox,
            { backgroundColor: theme.colors.tertiaryContainer },
          ]}>
          <Text style={styles.chipText}>✨ AI 요약 </Text>
        </View>
        <View style={styles.contentBox}>
          <Text
            style={[
              styles.contentText,
              {
                color: theme.colors.onBackground,
              },
            ]}>
            {post.content}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.chipBox,
            { backgroundColor: theme.colors.tertiaryContainer },
          ]}>
          <Text style={styles.chipText}>🔥 동기 부여</Text>
        </View>
        <View style={styles.contentBox}>
          <Text
            style={[
              styles.contentText,
              {
                color: theme.colors.onBackground,
              },
            ]}>
            {post.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    marginHorizontal: '2%',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: '1%',
  },
  contentBox: {
    flex: 1,
    marginRight: '1%',
  },
  contentText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  chipBox: {
    alignItems: 'center',
    width: '23%',
    borderRadius: 5,
    paddingHorizontal: '2%',
    marginRight: '2%',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
});

export default PostDetailAiBody;
