// import { StyleSheet } from 'react-native';
import React from 'react';
import { Appbar, useTheme, Button } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

interface Props extends NativeStackHeaderProps {
  title: string;
}

const AuthNavBarHeader = ({ navigation, back, title }: Props) => {
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
        <Appbar.Content title={title} color={theme.colors.primary} />
        <Button onPress={navigation.popToTop}>나가기</Button>
      </Appbar.Header>
      {/* <ProgressBar progress={0.1} color={theme.colors.primary} /> */}
    </>
  );
};

export default AuthNavBarHeader;
