import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { FAB } from 'react-native-paper';

type Props = {
  icon: string;
  customStyle?: ViewStyle;
  onPress: () => void;
};
const CustomFAB = ({ icon, customStyle, onPress }: Props) => {
  return (
    <FAB icon={icon} style={customStyle ?? styles.fab} onPress={onPress} />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomFAB;
