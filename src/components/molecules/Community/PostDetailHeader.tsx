import React from 'react';
import { StyleSheet, View } from 'react-native';
import Username from '/components/atoms/Common/Username';
import RelativeTime from '/components/atoms/Common/RelativeTime';
import PostReportButton from '/components/atoms/Common/ReportButton';
type Props = {
  postId: number;
  user: User;
  updatedAt: Date;
};

export default function PostDetailHeader({ postId, user, updatedAt }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.nameAndTime}>
        <Username username={user.username} />
        <RelativeTime date={updatedAt} />
      </View>
      <PostReportButton targetType="Post" targetId={postId} />
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
