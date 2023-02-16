import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Menu, Surface, Text } from 'react-native-paper';

type Props = {
  gender: string;
  title: string;
  setMyInfoState: React.Dispatch<React.SetStateAction<MyInfoRead>>;
};

const GenderMenu = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const genderListKorean = ['남성', '여성', '그 외'];
  const genderList = ['male', 'female', 'other'];
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    genderList.indexOf(props.gender),
  );

  return (
    <View style={styles.menuContainer}>
      <Surface elevation={4} style={styles.surface}>
        <Text variant="labelLarge">{props.title}</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={styles.menu}
          anchor={
            <Button disabled mode="contained-tonal" onPress={openMenu}>
              {genderListKorean[selectedGenderIndex]}
            </Button>
          }>
          {genderList.map((item, idx) => (
            <Menu.Item
              key={item}
              onPress={() => {
                setSelectedGenderIndex(idx);
                props.setMyInfoState(prevState => ({
                  ...prevState,
                  gender: item,
                }));
                closeMenu();
              }}
              title={genderListKorean[idx]}
            />
          ))}
        </Menu>
      </Surface>
    </View>
  );
};

export default GenderMenu;

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
