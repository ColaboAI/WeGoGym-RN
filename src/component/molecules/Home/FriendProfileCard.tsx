import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, Avatar } from 'react-native-paper';
import { Profile } from '@/types';

const FriendProfileCard = ({ uri, size, username }: Profile) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <Avatar.Image size={size} source={{ uri: uri }} style={styles.avatar} />
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
  avatar: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendProfileCard;
