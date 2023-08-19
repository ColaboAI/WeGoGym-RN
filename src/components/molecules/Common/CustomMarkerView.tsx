import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomMarkerViewProps {
  children: ReactNode;
}

const CustomMarkerView: React.FC<CustomMarkerViewProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <View style={styles.customMarkerContainer}>
      <View
        style={[
          styles.customMarker,
          { backgroundColor: theme.colors.tertiary },
        ]}>
        <Icon
          name="barbell-outline"
          size={24}
          color={theme.colors.onTertiary}
        />
      </View>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  customMarkerContainer: {
    alignItems: 'center',
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenContainer: {
    marginTop: 5,
  },
});

export default CustomMarkerView;
