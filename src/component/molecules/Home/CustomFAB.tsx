import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

type Props = {
  icon: string;
  onPress: () => void;
};
const CustomFAB = ({ icon, onPress }: Props) => {
  return <FAB icon={icon} style={styles.fab} onPress={onPress} />;
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
