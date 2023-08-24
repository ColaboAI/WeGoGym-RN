import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CommentInput from '/components/molecules/Community/CommentInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated from 'react-native-reanimated';
type Props = {
  postId: number;
};
const AnimatedView = Animated.createAnimatedComponent(View);

const CommentToolbar = ({ postId }: Props) => {
  const inset = useSafeAreaInsets();
  const inputAccessoryStyle = {
    height: Platform.OS === 'ios' ? inset.bottom + 44 : 50,
  };
  const [inputText, setInputText] = useState<string>('');

  return (
    <AnimatedView style={[inputAccessoryStyle]}>
      <CommentInput
        postId={postId}
        inputText={inputText}
        setInputText={setInputText}
      />
    </AnimatedView>
  );
};

export default CommentToolbar;

const styles = StyleSheet.create({
  inputAccessoryView: {
    zIndex: 1,
  },
});
