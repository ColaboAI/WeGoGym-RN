import React from 'react';
import { StyleSheet, View } from 'react-native';
import Username from '/components/atoms/Common/Username';
import CommentReportButton from '../../atoms/Common/ReportButton';
import RelativeTime from '/components/atoms/Common/RelativeTime';
type Props = {
  commentId: number;
  user: User;
  updatedAt: Date;
};

export default function CommentHeader({ user, updatedAt, commentId }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.nameAndTime}>
        <Username username={user.username} />
        <RelativeTime date={updatedAt} />
      </View>
      <CommentReportButton targetType="Comment" targetId={commentId} />
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
