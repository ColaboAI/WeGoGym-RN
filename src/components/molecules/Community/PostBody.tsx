import { StyleSheet, View } from 'react-native';
import React from 'react';
import PostContent from '/components/atoms/Community/PostContent';
import ImageSlide from '../Common/ImageSlide';

type Props = {
  post: PostRead;
};

export default function PostBody({ post }: Props) {
  return (
    <View style={styles.container}>
      <PostContent content={post.content} />
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
});
