import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
type Props = {
  navigateToUserDetails: (id: string) => void;
  id: string;
  profilePic?: string;
  username: string;
};

// TODO: 여러장의 프로필 카드 -> 가로 스크롤
const FriendProfileCard = ({
  id,
  profilePic,
  username,
  navigateToUserDetails,
}: Props) => {
  return (
    <View key={id} style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigateToUserDetails(id);
          }}>
          <CustomAvatar
            style={styles.avatar}
            size={60}
            profilePic={profilePic}
            username={username}
            userId={id}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.usernameContainer}>
        <Text variant="titleMedium">{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {},
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendProfileCard;
