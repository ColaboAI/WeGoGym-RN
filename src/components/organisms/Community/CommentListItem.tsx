import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import CommentContent from '/components/atoms/Community/CommentContent';
import CommentHeader from '/components/molecules/Community/CommentHeader';
import CommentFooter from '/components/molecules/Community/CommentFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { useNavigation } from '@react-navigation/native';
import { useAuthValue } from '/hooks/context/useAuth';

type Props = { comment: CommentRead };

export default function CommentListItem({ comment }: Props) {
  const nav = useNavigation();
  const authInfo = useAuthValue();
  const navigateToUser = useCallback(() => {
    nav.navigate('MainNavigator', {
      screen: '커뮤니티',
      params: {
        screen: 'User',
        params: {
          userId: comment.user.id === authInfo?.userId ? 'me' : comment.user.id,
        },
      },
    });
  }, [nav, comment.user.id, authInfo?.userId]);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <CustomAvatar
          size={20}
          profilePic={comment.user.profilePic}
          username={comment.user.username}
          onPress={navigateToUser}
        />
      </View>

      <View
        key={`post-${comment.postId}-cmt-${comment.id}`}
        style={styles.rightContainer}>
        <CommentHeader
          postId={comment.postId}
          commentId={comment.id}
          user={comment.user}
          updatedAt={comment.updatedAt}
        />
        <CommentContent content={comment.content} />
        <CommentFooter
          commentId={comment.id}
          likes={comment.likeCnt}
          isLiked={comment.isLiked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    marginTop: 10,
  },
  rightContainer: {
    flex: 9,
  },
});
