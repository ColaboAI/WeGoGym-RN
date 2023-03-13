import React from 'react';
import ChatInput, {
  ChatInputProps,
} from '/components/molecules/Chat/ChatInput';
import { StyleSheet, View } from 'react-native';

type Props = ChatInputProps;
const InputToolbar = (params: Props) => {
  return (
    <View style={styles.container}>
      <ChatInput {...params} />
    </View>
  );
};

export default InputToolbar;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
