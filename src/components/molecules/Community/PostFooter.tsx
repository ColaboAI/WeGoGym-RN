import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

type Props = {
  likes: number;
  comments: number;
};

export default function PostFooter({ likes, comments }: Props) {
  // TODO: likes, dislikes, comments를 받아와서 각각의 버튼에 넣어준다.
  // mutation을 통해 likes, dislikes, comments를 업데이트 해준다.

  return (
    <View style={styles.container}>
      <Button icon={'thumbs-up-outline'}>{likes}</Button>
      <Button icon={'thumbs-down-outline'}> </Button>
      <Button icon={'chatbox-outline'}>{comments}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
