import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Message } from 'src/types';
import { Text } from 'react-native-paper';

const Bubble = ({ _id, text, createdAt, user, isLeft }: Message) => {
  return (
    <View style={isLeft ? styles.leftBubble : styles.rightBubble}>
      <Text>{user.name}</Text>
      <Text>{text}</Text>
      <Text>{createdAt.toString()}</Text>
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  leftBubble: {
    marginRight: 60,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  rightBubble: {
    marginLeft: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
