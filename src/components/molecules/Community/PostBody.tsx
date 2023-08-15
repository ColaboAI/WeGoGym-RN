import { StyleSheet, View } from 'react-native';
import React from 'react';
import PostContent from '/components/atoms/Community/PostContent';
import ImageSlide from '../Common/ImageSlide';

type Props = {
  post: PostRead;
  onPress: (id: number) => void;
};

export default function PostBody({ post, onPress }: Props) {
  return (
    <View style={styles.container}>
      <PostContent postId={post.id} onPress={onPress} content={post.content} />
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
