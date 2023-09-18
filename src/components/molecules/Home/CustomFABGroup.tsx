import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

type Props = {
  onPressPosting: () => void;
  onPressPostCreate: () => void;
};

const CustomFABGroup = ({ onPressPosting, onPressPostCreate }: Props) => {
  const theme = useTheme();
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'close-outline' : 'add-outline'}
      label={open ? '' : '글쓰기'}
      actions={[
        {
          icon: 'barbell-outline',
          label: '운동 약속',
          color: theme.colors.onBackground,
          style: { backgroundColor: theme.colors.background },
          containerStyle: { backgroundColor: theme.colors.background },
          labelTextColor: theme.colors.onBackground,
          onPress: onPressPosting,
        },
        {
          icon: 'pencil-outline',
          label: '운동 질문',
          color: theme.colors.onBackground,
          style: { backgroundColor: theme.colors.background },
          containerStyle: { backgroundColor: theme.colors.background },
          labelTextColor: theme.colors.onBackground,
          onPress: onPressPostCreate,
        },
      ]}
      onStateChange={onStateChange}
      backdropColor={theme.colors.backdrop}
      style={styles.fabGroup}
    />
  );
};

const styles = StyleSheet.create({
  fabGroup: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default CustomFABGroup;
