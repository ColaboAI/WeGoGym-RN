import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import ChatInput from 'component/molecules/Chat/ChatInput';

const InputToolbar = () => {
  const [position, setPosition] = useState('absolute');
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => setPosition('relative'),
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setPosition('absolute'),
    );
    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  return (
    <View style={[styles.InputToolbarContainer, { position }] as ViewStyle}>
      <ChatInput />
    </View>
  );
};

export default InputToolbar;

const styles = StyleSheet.create({
  InputToolbarContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
});
