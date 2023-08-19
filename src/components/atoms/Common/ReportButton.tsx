import { StyleSheet } from 'react-native';
import React from 'react';
import { IconButton, Menu, useTheme } from 'react-native-paper';
import { useAuthActions } from '/hooks/context/useAuth';

interface Props {
  targetType: string;
  targetId?: string | number;
}

export default function PostReportButton({ targetType, targetId }: Props) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { setReportBottomSheetOpen, setReportTarget } = useAuthActions();
  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      contentStyle={[
        styles.menuContainer,
        { backgroundColor: theme.colors.background },
      ]}
      anchor={
        <IconButton
          size={15}
          icon={'ellipsis-horizontal-sharp'}
          onPress={() => {
            setMenuVisible(true);
          }}
        />
      }>
      <Menu.Item
        onPress={() => {
          setReportTarget(
            targetType,
            typeof targetId === 'number' ? targetId?.toString() : targetId,
          );
          setReportBottomSheetOpen(true);
          setMenuVisible(false);
        }}
        title="신고하기"
      />
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
