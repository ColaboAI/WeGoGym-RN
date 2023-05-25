import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';
import { ScrollView } from 'react-native-gesture-handler';

type Props = AuthStackScreenProps<'WorkoutStyleAndRoutine'>;
export default function WorkoutStyleAndRoutineScreen({ navigation }: Props) {
  const theme = useTheme();
  const workoutStyleButtons = [
    { id: 0, style: '프리웨이트' },
    { id: 1, style: '머신 운동' },
    { id: 2, style: '맨몸 운동' },
    { id: 3, style: '파워 리프팅' },
    { id: 4, style: '유산소 운동' },
  ];
  const workoutRoutineButtons = [
    { id: 0, routine: '무분할' },
    { id: 1, routine: '2분할' },
    { id: 2, routine: '3분할' },
    { id: 3, routine: '4분할' },
    { id: 4, routine: '5분할' },
  ];
  const [workoutStyle, setWorkoutStyle] = useState<string>('');
  const [workoutRoutine, setWorkoutRoutine] = useState<string>('');

  return (
    <SafeAreaView style={style.container}>
      <Text style={[style.helperTextBox, { color: theme.colors.outline }]}>
        프로필을 완성하기 위해 몇 가지만 여쭤볼게요. 잠깐이면 됩니다!
      </Text>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          선호하는 운동 방식과 루틴을 알려주세요.
        </Headline>
      </View>
      <View style={style.workoutStyleAndRoutineBox}>
        <View style={style.workoutStyleContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
            운동 방식
          </Text>
          <ScrollView
            style={style.horizontalButtonContainer}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {workoutStyleButtons.map(button => {
              return (
                <Button
                  key={`workout-style-${button.id}`}
                  style={style.button}
                  mode={
                    button.style === workoutStyle ? 'contained' : 'elevated'
                  }
                  onPress={() => {
                    setWorkoutStyle(button.style);
                  }}>
                  {button.style}
                </Button>
              );
            })}
          </ScrollView>
        </View>
        <View style={style.workoutRoutineContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
            운동 루틴
          </Text>
          <ScrollView
            style={style.horizontalButtonContainer}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {workoutRoutineButtons.map(button => {
              return (
                <Button
                  key={`workout-routine-${button.id}`}
                  style={style.button}
                  mode={
                    button.routine === workoutRoutine ? 'contained' : 'elevated'
                  }
                  onPress={() => {
                    setWorkoutRoutine(button.routine);
                  }}>
                  {button.routine}
                </Button>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!workoutStyle || !workoutRoutine}
          onPress={() => {
            save('workoutStyle', workoutStyle);
            save('workoutRoutine', workoutRoutine);
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
  helperTextBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: '5%',
  },
  headlineBox: {
    flex: 1,
    margin: '5%',
    justifyContent: 'center',
  },
  workoutStyleAndRoutineBox: {
    flex: 2,
    margin: '5%',
  },
  workoutStyleContainer: {
    marginBottom: '5%',
  },
  workoutRoutineContainer: {
    marginBottom: '5%',
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  button: {
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  buttonBox: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
