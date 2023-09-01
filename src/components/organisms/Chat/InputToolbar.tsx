import React from 'react';
import ChatInput, {
  ChatInputProps,
} from '/components/molecules/Chat/ChatInput';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
type Props = ChatInputProps;
const InputToolbar = (params: Props) => {
  const theme = useTheme();
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        params.animatedStyle,
      ]}>
      <ChatInput {...params} />
    </Animated.View>
  );
};

export default InputToolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});
