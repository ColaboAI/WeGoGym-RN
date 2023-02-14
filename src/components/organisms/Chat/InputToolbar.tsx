import React from 'react';
import ChatInput from '/components/molecules/Chat/ChatInput';
import { StyleSheet, View } from 'react-native';

const InputToolbar = () => {
  return (
    <View style={styles.container}>
      <ChatInput />
    </View>
  );
};

export default InputToolbar;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
