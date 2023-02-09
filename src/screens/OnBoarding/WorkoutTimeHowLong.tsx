import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { save } from '../../store/store';
import { AuthStackScreenProps } from '@/navigators/types';

type Props = AuthStackScreenProps<'WorkoutTimeHowLong'>;
export default function WorkoutTimeHowLongScreen({ navigation }: Props) {
  const theme = useTheme();
  const buttons = [
    '1시간 이하',
    '1시간 이상 2시간 미만',
    '2시간 이상 3시간 미만',
    '3시간 이상',
  ];
  const [howLong, setHowLong] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === howLong ? 'contained' : 'elevated'}
        onPress={() => {
          setHowLong(buttons[id]);
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
          보통 운동을 몇 시간 정도 하시나요?
        </Headline>
      </View>
      <View style={style.workoutTimeHowLongBox}>
        <View style={style.workoutTimeHowLongButtonBox}>
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
          {getButton(3)}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!howLong}
          onPress={() => {
            save('workout_time_how_long', howLong);
            navigation.navigate('WorkoutPerWeek');
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
  workoutTimeHowLongBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  workoutTimeHowLongButtonBox: {
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
