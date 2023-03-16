import { StyleSheet, View } from 'react-native';
import React from 'react';
import NotificationCard from '/components/molecules/Home/NotificationCard';

export default function NotificationsScreen() {
  return (
    <View style={style.container}>
      <NotificationCard />
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
