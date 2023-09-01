import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import PostContent from '/components/atoms/Community/PostContent';
import ImageSlide from '../Common/ImageSlide';
import { Text } from 'react-native-paper';

type Props = {
  post: PostRead;
  onPress: ({
    postId,
    communityId,
  }: {
    postId: number;
    communityId: number;
  }) => void;
};

export default function PostBody({ post, onPress }: Props) {
  return (
    <Pressable
      onPress={() =>
        onPress({ postId: post.id, communityId: post.communityId })
      }>
      <View style={styles.container}>
        <Text style={styles.title}>{post.title}</Text>
        <PostContent
          postId={post.id}
          communityId={post.communityId}
          onPress={onPress}
          content={post.content}
        />
        {post.image && post.image.length > 0 && (
          <ImageSlide imageUrls={post.image} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
