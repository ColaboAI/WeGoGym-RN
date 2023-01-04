import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AvoidingViewProps = {
  children: React.ReactNode;
};

const TextInputAvoidingView = ({ children }: AvoidingViewProps) => {
  const headerHeight = useHeaderHeight();
  const inset = useSafeAreaInsets();
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={[styles.wrapper, { marginBottom: inset.bottom }]}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <>{children}</>
  );
};

export default TextInputAvoidingView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
