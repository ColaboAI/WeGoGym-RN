import { useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  KeyboardContext,
  KeyboardController,
  AndroidSoftInputModes,
} from 'react-native-keyboard-controller';

function useKeyboardAnimation() {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
      );

      return () => KeyboardController.setDefaultMode();
    }, []),
  );

  const context = useContext(KeyboardContext);

  return context.animated;
}

export { useKeyboardAnimation };
