import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { getGoal } from '../../utils/util';
import { AuthStackScreenProps } from '/navigators/types';
type Props = AuthStackScreenProps<'WorkoutGoal'>;

export default function WorkoutGoalScreen({ navigation }: Props) {
  const theme = useTheme();
  const [isSelected, setIsSelected] = useState<WorkoutGoal[]>([
    { id: 0, goal: '💪🏻 근성장', select: false },
    { id: 1, goal: '🚴🏻 체력 증진', select: false },
    { id: 2, goal: '🏋🏻‍♂️ 벌크업', select: false },
    { id: 3, goal: '🏃🏻 다이어트', select: false },
    { id: 4, goal: '🤼 운동 파트너 만들기', select: false },
    { id: 5, goal: '👩🏻‍⚕️ 영양 정보', select: false },
    { id: 6, goal: '🥗 식단 관리', select: false },
    { id: 7, goal: '🤽🏻‍♂️ 복근 만들기', select: false },
    { id: 8, goal: '🧍🏻 마른 몸 벗어나기', select: false },
    { id: 9, goal: '🍎 애플힙 만들기', select: false },
  ]);

  const onToggle = (id: number) => {
    setIsSelected(
      isSelected.map(goal =>
        goal.id === id ? { ...goal, select: !goal.select } : goal,
      ),
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
          해결하고 싶은 고민이 무엇인가요?
        </Headline>
      </View>
      <View style={style.workoutGoalBox}>
        <View style={style.workoutGoalButton}>
          {isSelected.map(button => {
            return (
              <Button
                key={`select-${button.id}`}
                style={[style.button]}
                mode={button.select ? 'contained' : 'elevated'}
                onPress={() => {
                  onToggle(button.id);
                }}>
                {button.goal}
              </Button>
            );
          })}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          onPress={() => {
            const workoutGoal = getGoal(isSelected);
            save('workoutGoal', workoutGoal);
            navigation.navigate('ProfileImage');
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
    flexShrink: 1,
    margin: '5%',
    justifyContent: 'flex-start',
  },
  workoutGoalBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  workoutGoalButton: {
    flexDirection: 'row',
    margin: '1%',
    flexWrap: 'wrap',
  },
  button: {
    margin: '2%',
  },
  buttonBox: {
    flexShrink: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
