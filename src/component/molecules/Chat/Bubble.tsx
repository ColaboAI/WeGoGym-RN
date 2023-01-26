import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Message } from 'types';
import { Text, useTheme } from 'react-native-paper';

const Bubble = ({ _id, text, createdAt, user, isLeft }: Message) => {
  const theme = useTheme();

  return (
    <View
      style={[
        isLeft ? styles.leftBubble : styles.rightBubble,
        {
          backgroundColor: isLeft
            ? theme.colors.secondary
            : theme.colors.primary,
        },
      ]}>
      <Text
        style={{
          color: isLeft ? theme.colors.onSecondary : theme.colors.onPrimary,
        }}>
        {user.name}
      </Text>
      <Text
        style={{
          color: isLeft ? theme.colors.onSecondary : theme.colors.onPrimary,
        }}>
        {text}
      </Text>
      <Text
        style={{
          color: isLeft ? theme.colors.onSecondary : theme.colors.onPrimary,
        }}>
        {createdAt.toString()}
      </Text>
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  leftBubble: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginRight: 60,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },

  rightBubble: {
    alignSelf: 'flex-end',
    marginLeft: 60,
    marginRight: 10,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    marginBottom: 10,
  },
});
