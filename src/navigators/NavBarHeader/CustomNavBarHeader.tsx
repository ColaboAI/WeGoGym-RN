// import { StyleSheet } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Route } from '@react-navigation/native';
import { ChatParamList } from '../types';
type Props = NativeStackHeaderProps & {
  route: Route<string, ChatParamList | undefined>;
};

const CustomNavBarHeader = ({ navigation, back, route }: Props) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [newBack, setNewBack] = React.useState(back);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [title, setTitle] = React.useState(route.name);
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
    // setCanGoBack(navigation.canGoBack());
    if (route && route.params && route.params.chatRoomName !== undefined) {
      setTitle(route.params.chatRoomName);
    }
    return () => {
      setTitle(route.name);
    };
    // console.log(navigation);
  }, [back, navigation, route]);
  return (
    <Appbar.Header>
      {newBack ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={title} color={theme.colors.onBackground} />
      {!newBack ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="menu"
              color={theme.colors.onBackground}
              onPress={openMenu}
            />
          }>
          <Menu.Item
            onPress={() => {
              console.log('Option 1 was pressed');
            }}
            title="Option 1"
          />
          <Menu.Item
            onPress={() => {
              console.log('Option 2 was pressed');
            }}
            title="Option 2"
          />
          <Menu.Item
            onPress={() => {
              console.log('Option 3 was pressed');
            }}
            title="Option 3"
          />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
};

export default CustomNavBarHeader;

// const styles = StyleSheet.create({});
