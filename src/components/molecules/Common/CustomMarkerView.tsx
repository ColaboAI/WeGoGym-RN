import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomMarkerViewProps {
  children: ReactNode;
  customMarkerStyle?: StyleProp<ViewStyle>;
  size?: number;
}

const CustomMarkerView = (props: CustomMarkerViewProps) => {
  const theme = useTheme();
  return (
    <View style={styles.customMarkerContainer}>
      <View style={props.customMarkerStyle}>
        <Icon
          name="barbell-outline"
          size={props.size ? props.size : 24}
          color={theme.colors.onTertiary}
        />
      </View>
      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  customMarkerContainer: {
    alignItems: 'center',
  },
  childrenContainer: {
    marginTop: 5,
  },
});

export default CustomMarkerView;
