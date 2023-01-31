import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function NotificationssScreen() {
  return (
    <View style={style.container}>
      <Text>Notifications Screen</Text>
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
