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
          titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
        />
      </Appbar.Header>
    </>
  );
};

export default PostingNavBarHeader;
