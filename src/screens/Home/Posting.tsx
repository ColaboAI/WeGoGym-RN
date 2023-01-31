import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function PostingScreen() {
  return (
    <View style={style.container}>
      <Text>Posting Screen</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
