import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, List, Text, useTheme } from 'react-native-paper';

type Props = {
  name: string;
  description: string;
  createdAt: Date;
  lastMessageText: string;
  lastMessageCreatedAt: Date;
  members: ChatRoomMember[];
  onPress: () => void;
};

const ChatListItem = ({
  name,
  description,
  createdAt,
  lastMessageText,
  lastMessageCreatedAt,
  members,
  onPress,
}: Props) => {
  const theme = useTheme();
  const profilePic = members[0].user.profilePic;
  const unreadCount = 13;
  return (
    <List.Item
      title={name}
      description={lastMessageText ?? description}
      style={{
        backgroundColor: theme.colors.background,
      }}
      titleStyle={{
        color: theme.colors.onBackground,
      }}
      left={props =>
        profilePic ? (
          <Avatar.Image {...props} size={48} source={{ uri: profilePic }} />
        ) : (
          <Avatar.Text
            {...props}
            size={48}
            label={name}
            labelStyle={{ color: theme.colors.onPrimary }}
          />
        )
      }
      right={() => (
        <View style={styles.rightContainer}>
          <Text variant={'labelSmall'}>어제</Text>
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </View>
      )}
      // TODO: Fix this typing error
      onPress={onPress}
    />
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
