import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

function ChatDetail() {
  const theme = useTheme();
  return (
    <View style={style.container}>
      <Text style={{ color: theme.colors.onBackground }}>채팅방 디테일</Text>
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
export default ChatDetail;
