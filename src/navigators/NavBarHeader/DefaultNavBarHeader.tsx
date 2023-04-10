import React from 'react';
import { Appbar } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

type Props = NativeStackHeaderProps & {
  title: string;
};

const DefaultNavBarHeader = ({ navigation, back, title }: Props) => {
  return (
    <>
      <Appbar.Header>
        {back ? (
          <Appbar.BackAction
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

export default DefaultNavBarHeader;
