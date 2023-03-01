import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function MyWorkoutPromisesScreen() {
  return (
    <View style={style.container}>
      <Text>게시글이 없습니다.</Text>
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
