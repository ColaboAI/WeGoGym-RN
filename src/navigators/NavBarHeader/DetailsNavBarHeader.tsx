import React from 'react';
import { Appbar } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const DetailsNavBarHeader = ({ navigation, back }: NativeStackHeaderProps) => {
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
        <Appbar.Content title="" />
      </Appbar.Header>
    </>
  );
};

export default DetailsNavBarHeader;
