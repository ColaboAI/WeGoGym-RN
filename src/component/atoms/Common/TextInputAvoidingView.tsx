import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  StyleSheet,
} from 'react-native';

type AvoidingViewProps = {
  children: React.ReactNode;
};

const TextInputAvoidingView = ({ children }: AvoidingViewProps) => {
  const { StatusBarManager } = NativeModules;

  useEffect(() => {
    Platform.OS === 'ios'
      ? StatusBarManager.getHeight((statusBarFrameData: { height: number }) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, [StatusBarManager]);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="padding"
      // TODO: 70이라는 숫자 ?.. 일단은 대입하면서 끼워맞춤
      // 아마도 Bottom Tab 때문 !! 이게 없었으면 44 더하기.
      keyboardVerticalOffset={statusBarHeight + 70}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <KeyboardAvoidingView style={styles.wrapper} behavior="position">
      {children}
    </KeyboardAvoidingView>
  );
};

export default TextInputAvoidingView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
