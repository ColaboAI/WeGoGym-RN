import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

interface Props extends NativeStackHeaderProps {
  title: string;
}

const DefaultNavBarHeader = ({ navigation, back, title }: Props) => {
  const theme = useTheme();
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
          color={theme.colors.primary}
        />
      </Appbar.Header>
    </>
  );
};

export default DefaultNavBarHeader;
