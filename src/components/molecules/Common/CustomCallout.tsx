import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CustomCalloutProps extends PropsWithChildren {}

const CustomCallout = (props: CustomCalloutProps) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.secondary,
          },
        ]}>
        <View style={styles.childrenContainer}>{props.children}</View>
      </View>
      <View
        style={[
          styles.arrowBorder,
          {
            borderTopColor: theme.colors.secondary,
          },
        ]}
      />
      <View
        style={[
          styles.arrow,
          {
            borderTopColor: theme.colors.secondary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    width: 140,
    height: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default CustomCallout;
