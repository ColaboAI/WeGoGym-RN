import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'WorkoutTimePeriod'>;

export default function WorkoutTimePeriodScreen({ navigation }: Props) {
  const theme = useTheme();
  const buttons = ['오전', '오후', '저녁', '새벽'];
  const [time, setTime] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === time ? 'contained' : 'elevated'}
        onPress={() => {
          setTime(buttons[id]);
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
          평소에 운동하는 시간대가 어떻게 되시나요?
        </Headline>
      </View>
      <View style={style.workoutTimeBox}>
        <View style={style.workoutTimeButtonBox}>
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
          {getButton(3)}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!time}
          onPress={() => {
            save('workoutTimePeriod', time);
            navigation.navigate('WorkoutTimePerDay');
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
    justifyContent: 'flex-end',
  },
  workoutTimeBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  workoutTimeButtonBox: {
    margin: '3%',
  },
  button: {
    margin: '2%',
  },
  buttonBox: {
    flex: 2,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
