import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'WorkoutPerWeek'>;
export default function WorkoutPerWeekScreen({ navigation }: Props) {
  const theme = useTheme();
  const buttons = ['1', '2', '3', '4', '5', '6'];
  const [workoutPerWeek, setWorkoutPerWeek] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === workoutPerWeek ? 'contained' : 'elevated'}
        onPress={() => {
          setWorkoutPerWeek(buttons[id]);
        }}>
        {id + 1}번
      </Button>
    );
  };

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
          disabled={!workoutPerWeek}
          onPress={() => {
            save('workoutPerWeek', workoutPerWeek);
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
  workoutPerWeekBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
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
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
