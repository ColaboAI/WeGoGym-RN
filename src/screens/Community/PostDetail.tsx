import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Props = {
  postId: number;
};

const PostDetail = ({ postId }: Props) => {
  return (
    <View>
      <Text>{postId}</Text>
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({});
