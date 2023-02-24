import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = PropsWithChildren<{
  fallback?: React.ReactNode;
}>;

const MyErrorBoundary = Catch(function MyErrorBoundary(
  props: Props,
  error?: Error,
) {
  if (error) {
    return (
      {props.fallback ? props.fallback  : (

        <View>
            <Text>Something went wrong</Text>
        </View>
    }
    );
  } else {
    return <React.Fragment>{props.children}</React.Fragment>;
  }
});
