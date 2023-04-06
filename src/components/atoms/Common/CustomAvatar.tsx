import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { Avatar, useTheme } from 'react-native-paper';

interface Props {
  profilePic?: string;
  username: string;
  size: number;
  style?: StyleProp<ViewStyle>;
}

function CustomAvatar(props: Props) {
  const theme = useTheme();
  const customStyleFromTheme = {
    text: {
      color: theme.colors.background,
      backgroundColor: theme.colors.onBackground,
    },
  };

  return (
    <View style={styles.avatarContainer}>
      {props.profilePic ? (
        <Avatar.Image
          size={props.size}
          source={{
            uri: props.profilePic,
          }}
          style={props.style ? props.style : styles.avatar}
        />
      ) : (
        <Avatar.Text
          size={props.size}
          label={props.username[0] ?? '?'}
          style={
            props.style
              ? [customStyleFromTheme.text, props.style]
              : [customStyleFromTheme.text, styles.avatar]
          }
        />
      )}
    </View>
  );
}

export default CustomAvatar;

const styles = StyleSheet.create({
  avatarContainer: { borderRadius: 100 },
  avatar: {},
});
