import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
  aiCoaching: AiCoachingRead;
};
type AiCoachingOption = {
  [key: string]: { title: string; bgStyle: string };
};
const PostDetailAiBody = ({ aiCoaching }: Props) => {
  const theme = useTheme();

  const options: AiCoachingOption = useMemo(() => {
    return {
      summary: { title: '💡 AI 요약', bgStyle: theme.colors.tertiaryContainer },
      answer: { title: '✨ AI 답변', bgStyle: theme.colors.tertiaryContainer },
      motivation: {
        title: '🔥 동기 부여',
        bgStyle: theme.colors.errorContainer,
      },
    };
  }, [theme.colors.errorContainer, theme.colors.tertiaryContainer]);

  const renderAiCoachingInfo = useCallback(
    (key: string) => {
      if (!aiCoaching[key]) return null;
      return (
        <View style={styles.contentContainer}>
          <View
            style={[styles.chipBox, { backgroundColor: options[key].bgStyle }]}>
            <Text style={styles.chipText}>{options[key].title}</Text>
          </View>
          <View style={styles.contentBox}>
            <Text
              style={[
                styles.contentText,
                {
                  color: theme.colors.onBackground,
                },
              ]}>
              {aiCoaching[key]}
            </Text>
          </View>
        </View>
      );
    },
    [aiCoaching, options, theme.colors.onBackground],
  );

  return (
    <View style={styles.container}>
      {/* Question Summary */}
      {renderAiCoachingInfo('summary')}
      {/* Answer */}
      {renderAiCoachingInfo('answer')}
      {/* Motivation */}
      {renderAiCoachingInfo('motivation')}
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
    textAlign: 'justify',
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
