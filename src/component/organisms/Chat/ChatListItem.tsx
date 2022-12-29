import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, List, Text, useTheme } from 'react-native-paper';

type Props = {
  name: string;
  lastMessage: string;
  profilePic: string | null;
  unreadCount: number;
};

const ChatListItem = ({
  name,
  lastMessage,
  profilePic,
  unreadCount,
}: Props) => {
  const theme = useTheme();
  return (
    <List.Item
      title={name}
      description={lastMessage}
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
            label={name[0]}
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
      onPress={() => navigation.navigate('ChatDetail')}
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
