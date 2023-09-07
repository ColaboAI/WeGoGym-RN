import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Username from '/components/atoms/Common/Username';
import RelativeTime from '/components/atoms/Common/RelativeTime';
import PostReportButton from '/components/atoms/Common/ReportButton';
import { useAuthValue } from '/hooks/context/useAuth';
import { usePostDeleteMutation } from '/hooks/queries/post.queries';
import { useNavigation } from '@react-navigation/native';

type Props = {
  communityId: number;
  postId: number;
  user: User;
  updatedAt: Date;
  onPressEdit: (postId: number) => void;
};

export default function PostDetailHeader({
  communityId,
  postId,
  user,
  updatedAt,
  onPressEdit,
}: Props) {
  const nav = useNavigation();
  const myId = useAuthValue().userId;
  const isMine = myId === user.id;
  const { mutate: deletePost } = usePostDeleteMutation(communityId);
  const handleDelete = useCallback(() => {
    deletePost(postId);
    if (nav.canGoBack()) {
      nav.goBack();
    }
  }, [deletePost, nav, postId]);
  return (
    <View style={styles.container}>
      <View style={styles.nameAndTime}>
        <Username username={user.username} />
        <RelativeTime date={updatedAt} />
      </View>
      <PostReportButton
        targetType="Post"
        targetId={postId}
        isMine={isMine}
        handleDelete={handleDelete}
        handleEdit={() => onPressEdit?.(postId)}
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
