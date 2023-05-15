import React from 'react';
import ChatInput, {
  ChatInputProps,
} from '/components/molecules/Chat/ChatInput';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = ChatInputProps;
const InputToolbar = (params: Props) => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ChatInput {...params} />
    </View>
  );
};

export default InputToolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
