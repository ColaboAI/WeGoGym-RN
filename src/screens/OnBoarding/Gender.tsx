import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { save } from '../../store/store';
export default function GenderScreen({ navigation }: any) {
  const theme = useTheme();
  const buttons = ['🙍‍♂️ 남성', '🙍‍♀️ 여성', '그 외 성별'];
  const [gender, setGender] = useState<string>('');

  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={buttons[id] === gender ? 'contained' : 'elevated'}
        onPress={() => {
          setGender(buttons[id]);
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
          성별이 어떻게 되시나요?
        </Headline>
      </View>
      <View style={style.workoutLevelBox}>
        <View style={style.workoutLevelButtonBox}>
          {getButton(0)}
          {getButton(1)}
          {getButton(2)}
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!gender}
          onPress={() => {
            save('gender', gender);
            navigation.navigate('BodyInformation');
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
