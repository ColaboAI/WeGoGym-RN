import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Menu, Surface, Text } from 'react-native-paper';

type Props = {
  workoutLevel: string;
  title: string;
  setMyInfoState: React.Dispatch<React.SetStateAction<MyInfoRead>>;
};

const WorkoutLevelMenu = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const workoutLevelList = [
    '입문(1년 미만)',
    '초급(1년 이상 3년 미만)',
    '중급(3년 이상 5년 미만)',
    '고급(5년 이상)',
    '전문가',
  ];
  const [selectedworkoutLevel, setSelectedworkoutLevel] = useState(
    props.workoutLevel,
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
            <Button mode="contained-tonal" onPress={openMenu}>
              {selectedworkoutLevel.split('(')[0]}
            </Button>
          }>
          {workoutLevelList.map((item, _) => (
            <Menu.Item
              key={item}
              onPress={() => {
                setSelectedworkoutLevel(item);
                props.setMyInfoState(prevState => ({
                  ...prevState,
                  workoutLevel: item,
                }));
                closeMenu();
              }}
              title={item}
            />
          ))}
        </Menu>
      </Surface>
    </View>
  );
};

export default WorkoutLevelMenu;

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
