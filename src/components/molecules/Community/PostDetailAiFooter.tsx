import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useAiCoachingDisLikeMutation,
  useAiCoachingLikeMutation,
} from '/hooks/queries/ai.queries';

type Props = {
  aiCoachingId: number;
  likes: number;
  isLiked: number;
};

export default function PostDetailAiFooter({
  aiCoachingId,
  likes,
  isLiked,
}: Props) {
  const ICON_SIZE = 15;
  const theme = useTheme();
  const iconColor = theme.colors.onBackground;
  const likeMutation = useAiCoachingLikeMutation();
  const dislikeMutation = useAiCoachingDisLikeMutation();

  const handleLike = () => {
    likeMutation.mutate(aiCoachingId);
  };

  const handleDisLike = () => {
    dislikeMutation.mutate(aiCoachingId);
  };

  return (
    <View style={styles.container}>
      <Icon
        name={isLiked === 1 ? 'thumb-up' : 'thumb-up-outline'}
        size={ICON_SIZE}
        color={iconColor}
        style={styles.icon}
        onPress={handleLike}>
        <Text variant="labelMedium">{likes}</Text>
      </Icon>
      <Icon
        name={isLiked === 0 ? 'thumb-down' : 'thumb-down-outline'}
        size={ICON_SIZE}
        color={iconColor}
        style={styles.icon}
        onPress={handleDisLike}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '25%',
    marginTop: '2%',
  },
  icon: {
    letterSpacing: 3,
    paddingRight: 30,
  },
});
