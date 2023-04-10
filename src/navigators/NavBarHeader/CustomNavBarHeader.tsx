// import { StyleSheet } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Route } from '@react-navigation/native';
import { ChatParamList } from '../types';
import { useAuthActions } from '/hooks/context/useAuth';
type Props = NativeStackHeaderProps & {
  route: Route<string, ChatParamList | undefined>;
};

const CustomNavBarHeader = ({ navigation, back, route }: Props) => {
  const theme = useTheme();
  const [newBack, setNewBack] = React.useState(back);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { setReportBottomSheetOpen, setReportTarget } = useAuthActions();
  const headerTitle = useMemo(() => {
    const routeName = route.name;
    switch (routeName) {
      case 'ChatList':
        return '채팅';
      case 'ChatRoom':
        return route.params?.chatRoomName || '채팅방';
    }
  }, [route.name, route.params?.chatRoomName]);

  useLayoutEffect(() => {
    if (
      route.name === 'ChatRoom' &&
      back === undefined &&
      navigation.canGoBack() === true
    ) {
      setNewBack({ title: 'ChatList' });
      navigation.reset({
        index: 1,
        routes: [{ name: 'ChatList' }, { name: 'ChatRoom' }],
      });
    }
  }, [back, navigation, route]);
  return (
    <Appbar.Header>
      {newBack ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={headerTitle} color={theme.colors.onBackground} />
      {route.name === 'ChatRoom' && (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="ellipsis-vertical"
              onPress={() => {
                setMenuVisible(true);
              }}
            />
          }>
          <Menu.Item
            onPress={() => {
              setReportTarget(route.name, route.params?.chatRoomId);
              setReportBottomSheetOpen(true);
              setMenuVisible(false);
            }}
            title="신고하기"
          />
        </Menu>
      )}
    </Appbar.Header>
  );
};

export default CustomNavBarHeader;
