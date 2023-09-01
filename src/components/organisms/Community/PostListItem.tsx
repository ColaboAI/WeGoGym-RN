import { StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';

import PostHeader from '/components/molecules/Community/PostHeader';
import PostBody from '/components/molecules/Community/PostBody';
import PostFooter from '/components/molecules/Community/PostFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { useNavigation } from '@react-navigation/native';
import { useAuthValue } from '/hooks/context/useAuth';

interface Props {
  post: PostRead;
  user: User;
  onPressDetail: ({
    postId,
    communityId,
  }: {
    postId: number;
    communityId: number;
  }) => void;
  onPressEdit: (postId: number) => void;
}

export default function PostListItem({
  post,
  user,
  onPressDetail,
  onPressEdit,
}: Props) {
  const authInfo = useAuthValue();

  const nav = useNavigation();
  const navigateToUser = useCallback(() => {
    nav.navigate('MainNavigator', {
      screen: '커뮤니티',
      params: {
        screen: 'User',
        params: {
          userId: user.id === authInfo?.userId ? 'me' : user.id,
        },
      },
    });
  }, [authInfo?.userId, nav, user.id]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <CustomAvatar
          size={32}
          profilePic={user.profilePic}
          username={user.username}
          onPress={navigateToUser}
        />
      </View>
      <View style={styles.postContainer}>
        <PostHeader
          postId={post.id}
          user={user}
          updatedAt={post.updatedAt}
          onPressEdit={onPressEdit}
        />
        <PostBody onPress={onPressDetail} post={post} />
        <PostFooter
          postId={post.id}
          communityId={post.communityId}
          likes={post.likeCnt}
          comments={post.commentCnt}
          isLiked={post.isLiked}
          onPress={onPressDetail}
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
