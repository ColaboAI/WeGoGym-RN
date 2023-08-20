import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Username from '/components/atoms/Common/Username';
import CommentReportButton from '../../atoms/Common/ReportButton';
import RelativeTime from '/components/atoms/Common/RelativeTime';
import { useAuthValue } from '/hooks/context/useAuth';
import { useCommentDeleteMutation } from '../../../hooks/queries/comment.queries';
type Props = {
  postId: number;
  commentId: number;
  user: User;
  updatedAt: Date;
};

export default function CommentHeader({
  user,
  updatedAt,
  commentId,
  postId,
}: Props) {
  const myId = useAuthValue().userId;
  const isMine = myId === user.id;

  const { mutate: deleteComment } = useCommentDeleteMutation(postId);

  const handleDelete = useCallback(() => {
    deleteComment(commentId);
  }, [commentId, deleteComment]);

  return (
    <View style={styles.container}>
      <View style={styles.nameAndTime}>
        <Username username={user.username} />
        <RelativeTime date={updatedAt} />
      </View>
      <CommentReportButton
        targetType="Comment"
        targetId={commentId}
        handleDelete={isMine === true ? handleDelete : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameAndTime: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
