import { StyleSheet } from 'react-native';
import React from 'react';
import { IconButton, Menu, useTheme } from 'react-native-paper';
import { useAuthActions } from '/hooks/context/useAuth';

interface Props {
  targetType: string;
  targetId?: string | number;
  isMine?: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
}

export default function PostReportButton({
  targetType,
  targetId,
  isMine,
  handleDelete,
  handleEdit,
}: Props) {
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
      {isMine === false && (
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
      )}
      {isMine === true && (
        <Menu.Item
          onPress={() => {
            handleDelete();
            setMenuVisible(false);
          }}
          title="삭제하기"
        />
      )}
      {isMine === true && (
        <Menu.Item
          onPress={() => {
            handleEdit();
            setMenuVisible(false);
          }}
          title="수정하기"
        />
      )}
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
