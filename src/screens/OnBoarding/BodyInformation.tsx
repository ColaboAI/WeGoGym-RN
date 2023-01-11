import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import { save } from '../../store/store';

export default function BodyInformationScreen({ navigation }: any) {
  const theme = useTheme();
  const [age, setAge] = React.useState<string>('');
  const [height, setHeight] = React.useState<string>('');
  const [weight, setWeight] = React.useState<string>('');

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <SafeAreaView style={style.container}>
        <View style={style.headlineBox}>
          <Headline
            style={{
              color: theme.colors.secondary,
              fontWeight: 'bold',
              fontSize: 24,
              // backgroundColor: '#000000',
            }}>
            신체 정보를 알려주세요.
          </Headline>
        </View>
        <View style={style.textInputBox}>
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="나이(만)"
            keyboardType="numeric"
            value={age}
            onChangeText={value => setAge(value)}
          />
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="키(cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={value => setHeight(value)}
          />
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="몸무게(kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={value => setWeight(value)}
          />
        </View>
        <View style={style.buttonBox}>
          <Button
            mode="contained"
            disabled={age.length < 1 || height.length < 1 || weight.length < 1}
            onPress={() => {
              save('age', age);
              save('height', height);
              save('weight', weight);
              navigation.navigate('WorkoutPerWeek');
            }}>
            확인
          </Button>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  textInputBox: {
    flex: 1,
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    top: '25%',
  },
  textInput: {
    margin: '1.5%',
  },
  buttonBox: {
    width: '90%',
    position: 'absolute',
    top: '60%',
    alignSelf: 'center',
  },
});
