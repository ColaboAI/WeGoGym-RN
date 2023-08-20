import { View, StyleSheet } from 'react-native';
import React from 'react';
import CommentContent from '/components/atoms/Community/CommentContent';
import CommentHeader from '/components/molecules/Community/CommentHeader';
import CommentFooter from '/components/molecules/Community/CommentFooter';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';

type Props = { comment: CommentRead };

export default function CommentListItem({ comment }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <CustomAvatar
          size={20}
          profilePic={comment.user.profilePic}
          username={comment.user.username}
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
