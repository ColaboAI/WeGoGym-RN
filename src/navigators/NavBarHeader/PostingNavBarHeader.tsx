import React from 'react';
import { Appbar, IconButton } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

type Props = NativeStackHeaderProps & {
  title: string;
};

const PostingNavBarHeader = ({ navigation, back, title }: Props) => {
  return (
    <>
      <Appbar.Header>
        {back ? (
          <IconButton
            icon="close-outline"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : null}
        <Appbar.Content
          title={title}
          titleStyle={{ fontSize: 20, fontWeight: '600' }}
        />
      </Appbar.Header>
    </>
  );
};

export default PostingNavBarHeader;
