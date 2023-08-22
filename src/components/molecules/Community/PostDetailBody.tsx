import { StyleSheet, View } from 'react-native';
import React from 'react';
import PostDetailContent from '/components/atoms/Community/PostDetailContent';
import ImageSlide from '../Common/ImageSlide';
import { Text } from 'react-native-paper';

type Props = {
  post: PostRead;
};

export default function PostDetailBody({ post }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <PostDetailContent postId={post.id} content={post.content} />
      {post.image && post.image.length > 0 && (
        <ImageSlide imageUrls={post.image} />
      )}
    </View>
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
