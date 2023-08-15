import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  usePostDisLikeMutation,
  usePostLikeMutation,
} from '/hooks/queries/post.queries';
type Props = {
  postId: number;
  likes: number;
  isLiked: number;
};

export default function PostDetailFooter({ postId, likes, isLiked }: Props) {
  const ICON_SIZE = 10;
  const theme = useTheme();
  const iconColor = theme.colors.onBackground;
  const likeMutation = usePostLikeMutation();
  const dislikeMutation = usePostDisLikeMutation();

  const handleLike = () => {
    likeMutation.mutate(postId);
  };

  const handleDisLike = () => {
    dislikeMutation.mutate(postId);
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
    marginTop: '2%',
  },

  icon: {
    letterSpacing: 3,
    paddingRight: 30,
  },
});
