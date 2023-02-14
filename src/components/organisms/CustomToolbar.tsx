import { InputAccessoryView, Platform, StyleSheet, View } from 'react-native';
import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  nativeID?: string;
}>;

const CustomToolbar = ({ children, nativeID }: Props) => {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={nativeID ?? undefined}>
          {children}
        </InputAccessoryView>
      ) : (
        <>{children}</>
      )}
    </View>
  );
};

export default CustomToolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '80%',
  },
});
