import { useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  KeyboardContext,
  KeyboardController,
  AndroidSoftInputModes,
} from 'react-native-keyboard-controller';

function useResizeMode() {
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

function usePanMode() {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_PAN,
      );

      return () => KeyboardController.setDefaultMode();
    }, []),
  );

  const context = useContext(KeyboardContext);

  return context.animated;
}

export { useResizeMode, usePanMode };
