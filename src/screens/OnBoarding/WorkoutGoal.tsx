import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { save } from '@store/secureStore';
import { getGoal, getInfo } from '../../utils/util';
import { useAuthActions } from 'hooks/context/useAuth';

export default function WorkoutGoalScreen() {
  const theme = useTheme();
  const { signUp } = useAuthActions();
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

            const info = getInfo();
            if (info) {
              signUp(info);
            } else {
              Alert.alert('회원가입에 실패했습니다.', '다시 시도해주세요.');
            }
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
  workoutGoalBox: {
    flexGrow: 2,
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
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
