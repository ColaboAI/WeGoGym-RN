import {
  Keyboard,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  TextInput,
} from 'react-native';
import React, { useCallback, useLayoutEffect, useState, useRef } from 'react';
import { TextInput as RNTextInput, useTheme } from 'react-native-paper';
import {
  useCommentByIdQuery,
  useCommentMutation,
  useCommentUpdateMutation,
} from '/hooks/queries/comment.queries';
import Animated, { AnimatedStyleProp } from 'react-native-reanimated';

type Props = {
  postId: number;
  focusable?: boolean;
  animatedStyle: AnimatedStyleProp<ViewStyle>;
  selectedCommentId: number | null;
  setSelectedCommentId: (id: number | null) => void;
};

export default function CommentInput({
  postId,
  animatedStyle,
  focusable = true,
  selectedCommentId,
  setSelectedCommentId,
}: Props) {
  const theme = useTheme();
  const mutation = useCommentMutation();
  const updateMutation = useCommentUpdateMutation();
  const { data: comment } = useCommentByIdQuery(selectedCommentId);
  const [inputText, setInputText] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(() => {
    if (inputText.length === 0) {
      return;
    }
    if (selectedCommentId) {
      updateMutation.mutate({
        id: selectedCommentId,
        params: { content: inputText },
      });
      setSelectedCommentId(null);
    } else {
      mutation.mutate({
        postId,
        content: inputText,
      });
    }
    Keyboard.dismiss();
    setInputText('');
  }, [
    inputText,
    mutation,
    postId,
    selectedCommentId,
    setSelectedCommentId,
    updateMutation,
  ]);

  useLayoutEffect(() => {
    if (selectedCommentId !== null) {
      setInputText(comment?.content ?? '');
      inputRef.current?.focus();
    } else {
      setInputText('');
    }
  }, [comment, selectedCommentId]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        animatedStyle,
      ]}>
      <View style={styles.textInputContainer}>
        <RNTextInput
          ref={inputRef}
          mode="outlined"
          right={
            <RNTextInput.Icon
              style={styles.sendBtnIcon}
              mode="contained"
              icon="send"
              containerColor={'transparent'}
              underlayColor="transparent"
              color={theme.colors.onPrimaryContainer}
              disabled={inputText.length === 0 || mutation.isLoading}
              onPress={handleSubmit}
            />
          }
          value={inputText}
          style={styles.inputBar}
          outlineStyle={styles.outline}
          multiline={true}
          onChangeText={t => {
            setInputText(t);
          }}
          textAlignVertical="center"
          verticalAlign="middle"
          textAlign="left"
          disabled={mutation.isLoading}
          onSubmitEditing={handleSubmit}
          focusable={focusable}
          label={'댓글을 입력하세요'}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    paddingBottom: 5,
    position: 'absolute',
    bottom: 5,
    left: 0,
    width: '100%',
  },
  inputBar: {
    maxHeight: 80,
    width: '100%',
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  outline: {
    borderRadius: 20,
  },
  sendBtnIcon: {
    top: Platform.OS === 'ios' ? 2 : 0,
  },
});
