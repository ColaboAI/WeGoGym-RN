import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Menu, Surface, Text } from 'react-native-paper';

type Props = {
  selectedValue: string;
  title: string;
  titleKorean: string;
  valueList: string[];
  valueListKorean?: string[];
  setMyInfoState: React.Dispatch<React.SetStateAction<MyInfoRead>>;
};

const StringMenu = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const listKorean = props.valueListKorean ?? props.valueList;
  const list = props.valueList;
  const [selectedIndex, setSelectedIndex] = useState(
    list.indexOf(props.selectedValue),
  );

  return (
    <View style={styles.menuContainer}>
      <Surface elevation={1} style={styles.surface}>
        <Text variant="labelLarge">{props.titleKorean}</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={styles.menu}
          anchor={
            <Button
              disabled={props.title === 'gender'}
              mode="contained-tonal"
              onPress={openMenu}>
              {listKorean[selectedIndex]}
            </Button>
          }>
          {list.map((item, idx) => (
            <Menu.Item
              key={item}
              onPress={() => {
                setSelectedIndex(idx);
                props.setMyInfoState(prevState => ({
                  ...prevState,
                  [props.title]: item,
                }));
                closeMenu();
              }}
              title={listKorean[idx]}
            />
          ))}
        </Menu>
      </Surface>
    </View>
  );
};

export default StringMenu;

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  surface: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    height: 80,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
  },
});
