import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'WorkoutLevel'>;
export default function WorkoutLevelScreen({ navigation }: Props) {
  const theme = useTheme();
  const buttons = [
    '입문(1년 미만)',
    '초급(1년 이상 3년 미만)',
    '중급(3년 이상 5년 미만)',
    '고급(5년 이상)',
    '전문가',
  ];

  const [workoutLevel, setWorkoutLevel] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={
          buttons[id].split('(')[0] === workoutLevel ? 'contained' : 'elevated'
        }
        onPress={() => {
          setWorkoutLevel(buttons[id].split('(')[0]);
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
        {getButton(0)}
        {getButton(1)}
        {getButton(2)}
        {getButton(3)}
        {getButton(4)}
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!workoutLevel}
          onPress={() => {
            save('workoutLevel', workoutLevel);
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
    margin: '5%',
    justifyContent: 'center',
  },
  workoutLevelBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  button: {
    margin: '1%',
  },
  buttonBox: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
