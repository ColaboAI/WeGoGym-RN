import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';

export default function WorkoutPerWeekScreen({ navigation }: any) {
  const theme = useTheme();
  const buttons = ['1번', '2번', '3번', '4번', '5번', '6번'];
  const [select, setSelect] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === select ? 'contained' : 'elevated'}
        onPress={() => {
          setSelect(buttons[id]);
        }}>
        {id + 1}번
      </Button>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          일주일에 몇 번 운동을 하시나요?
        </Headline>
      </View>
      <View style={style.workoutPerWeekBox}>
        <View style={style.workoutPerWeekBox1}>
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
        </View>
        <View style={style.workoutPerWeekBox2}>
          {getButton(3)}
          {getButton(4)}
          {getButton(5)}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!select}
          onPress={() => {
            navigation.navigate('WorkoutLevel');
          }}>
          확인
        </Button>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  headlineBox: {
    flex: 1,
    position: 'absolute',
    top: '15%',
    left: '5%',
  },
  workoutPerWeekBox: {
    flex: 1,
    top: '25%',
  },
  workoutPerWeekBox1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '2.5%',
  },
  workoutPerWeekBox2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '2.5%',
  },
  button: {
    width: 90,
  },
  buttonBox: {
    width: '90%',
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
});
