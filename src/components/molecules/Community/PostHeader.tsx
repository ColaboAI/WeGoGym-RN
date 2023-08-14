import React from 'react';
import { StyleSheet, View } from 'react-native';
import Username from '/components/atoms/Common/Username';
import { IconButton } from 'react-native-paper';
import RelativeTime from '/components/atoms/Common/RelativeTime';
type Props = {
  user: User;
  updatedAt: Date;
};

function PostHeader({ user, updatedAt }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.nameAndTime}>
        <Username username={user.username} />
        <RelativeTime date={updatedAt} />
      </View>
      <IconButton size={10} icon={'ellipsis-horizontal-sharp'} />
    </View>
  );
}

export default PostHeader;

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
