import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';

type Props = {
  members?: ChatRoomMember[];
};

export default function ChatListAvatar({ members }: Props) {
  if (members === undefined) {
    return (
      <View style={styles.container}>
        <CustomAvatar size={48} username="?" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {members.map((member, idx) => {
        return (
          <CustomAvatar
            key={`chat-list-avatar-${idx}`}
            username={member.user.username}
            profilePic={member.user.profilePic}
            size={48 / members.length}
          />
        );
      })}
    </View>
  );
}
// TODO: Fix styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '20%',
    padding: '1%',
  },
});
