import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';

export default function WorkoutPerWeekScreen({ navigation }: any) {
  const theme = useTheme();
  const buttons = [
    '입문(1년 미만)',
    '초급(1년 이상 3년 미만)',
    '중급(3년 이상 5년 미만)',
    '고급(5년 이상)',
    '전문가',
  ];
  const [select, setSelect] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === select ? 'contained' : 'elevated'}
        onPress={() => {
          setSelect(buttons[id]);
        }}>
        {buttons[id]}
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
          운동 경력이 어느 정도 되시나요?
        </Headline>
      </View>
      <View style={style.workoutLevelBox}>
        <View style={style.workoutLevelButtonBox}>
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
          {getButton(3)}
          {getButton(4)}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!select}
          onPress={() => {
            navigation.navigate('WorkoutGoal');
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
  workoutLevelBox: {
    flex: 1,
    top: '25%',
  },
  workoutLevelButtonBox: {
    margin: '3%',
  },
  button: {
    margin: '2%',
  },
  buttonBox: {
    width: '90%',
    position: 'absolute',
    top: '70%',
    alignSelf: 'center',
  },
});
