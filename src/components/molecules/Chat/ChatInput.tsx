import React, { useState } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

// type Props = {};

const ChatInput = () => {
  const theme = useTheme();
  const [text, setText] = useState('');
  return (
    <TextInput
      mode="outlined"
      left={
        <TextInput.Icon
          mode="contained"
          icon="camera"
          containerColor={theme.colors.secondaryContainer}
          iconColor={theme.colors.onSecondaryContainer}
          style={{}}
          onPress={() => console.log('Camera Pressed')}
        />
      }
      right={
        <TextInput.Icon
          mode="contained"
          icon="arrow-up"
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.onPrimaryContainer}
          onPress={() => console.log('Send Pressed')}
        />
      }
      value={text}
      onChangeText={txt => setText(txt)}
      style={styles.ChatInputBar}
      outlineStyle={styles.Outline}
      multiline={true}
    />
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  ChatInputBar: {
    maxHeight: 80,
  },
  Outline: {
    borderRadius: 25,
    top: Platform.OS === 'ios' ? 0 : 6,
  },
});