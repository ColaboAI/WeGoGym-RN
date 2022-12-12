// import { StyleSheet } from 'react-native';
import React from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
interface Props extends NativeStackHeaderProps {
  title: string;
}
const CustomNavBarHeader = ({ navigation, back, title }: Props) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} color={theme.colors.onBackground} />
      {!back ? (
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
