import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React, { useMemo } from 'react';
import { Avatar, TouchableRipple, useTheme } from 'react-native-paper';

interface Props {
  username: string;
  size: number;
  onPress?: () => void;
  profilePic?: string;
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

  const renderAvatar = useMemo(() => {
    return props.profilePic ? (
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
    );
  }, [
    props.profilePic,
    props.size,
    props.style,
    props.username,
    customStyleFromTheme.text,
  ]);

  if (props.onPress) {
    return (
      <TouchableRipple
        style={styles.avatarContainer}
        borderless
        onPress={props.onPress}>
        {renderAvatar}
      </TouchableRipple>
    );
  } else {
    return <View style={styles.avatarContainer}>{renderAvatar}</View>;
  }
}

export default CustomAvatar;

const styles = StyleSheet.create({
  avatarContainer: { borderRadius: 100, alignSelf: 'center' },
  avatar: {},
});
