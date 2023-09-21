import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

type Props = {
  title: string;
  description: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomTooltip = ({ title, description, setVisible }: Props) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.secondary,
          },
        ]}>
        <View style={styles.childrenContainer}>
          <View style={styles.tooltipHeader}>
            <Text variant="titleSmall">{title}</Text>
            <IconButton
              icon="close-outline"
              size={12}
              onPress={() => setVisible(false)}
            />
          </View>
          <Text variant="bodySmall" style={styles.description}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bubble: {
    width: '75%',
    height: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 12,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  childrenContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  description: {
    textAlign: 'justify',
  },
});

export default CustomTooltip;
