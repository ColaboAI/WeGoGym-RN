import { Keyboard, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { useCommentMutation } from '/hooks/queries/comment.queries';
import Animated, { AnimatedStyleProp } from 'react-native-reanimated';
type Props = {
  postId: number;
  focusable?: boolean;
  animatedStyle: AnimatedStyleProp<ViewStyle>;
};

export default function CommentInput({
  postId,
  animatedStyle,
  focusable = true,
}: Props) {
  const theme = useTheme();
  const mutation = useCommentMutation();
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = useCallback(() => {
    if (inputText.length > 0) {
      mutation.mutate({ postId, content: inputText });
    }
  }, [inputText, mutation, postId]);

  useLayoutEffect(() => {
    if (mutation.isSuccess) {
      Keyboard.dismiss();
      setInputText('');
    }
  }, [mutation.isSuccess, setInputText]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        animatedStyle,
      ]}>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="outlined"
          dense={true}
          right={
            <TextInput.Icon
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
          placeholder="댓글 남기기"
          onChangeText={t => {
            setInputText(t);
          }}
          textAlignVertical="center"
          verticalAlign="middle"
          textAlign="left"
          disabled={mutation.isLoading}
          onSubmitEditing={handleSubmit}
          focusable={focusable}
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
    bottom: 0,
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
