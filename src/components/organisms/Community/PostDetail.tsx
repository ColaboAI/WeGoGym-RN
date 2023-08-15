import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PostHeader from '/components/molecules/Community/PostHeader';

type Props = {};

const PostDetail = (props: Props) => {
  return (
    <View>
      <PostHeader />
      <PostBody />
      <PostFooter />
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({});
