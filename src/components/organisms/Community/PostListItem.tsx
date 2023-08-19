import { StyleSheet, View } from 'react-native';
import React from 'react';

import PostHeader from '/components/molecules/Community/PostHeader';
import PostBody from '/components/molecules/Community/PostBody';
import PostFooter from '/components/molecules/Community/PostFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';

interface Props {
  post: PostRead;
  user: User;
  onPress: (postId: number) => void;
}

export default function PostListItem({ post, user, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <CustomAvatar
          size={32}
          profilePic={user.profilePic}
          username={user.username}
        />
      </View>
      <View style={styles.postContainer}>
        <PostHeader postId={post.id} user={user} updatedAt={post.updatedAt} />
        <PostBody onPress={onPress} post={post} />
        <PostFooter
          postId={post.id}
          likes={post.likeCnt}
          comments={post.commentCnt}
          isLiked={post.isLiked}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarContainer: {
    marginTop: '2%',
    paddingHorizontal: '2%',
  },
});
