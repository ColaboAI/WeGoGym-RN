import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React from 'react';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'BodyInformation'>;

export default function BodyInformationScreen({ navigation }: Props) {
  const theme = useTheme();
  const [age, setAge] = React.useState<string>('');
  const [height, setHeight] = React.useState<string>('');
  const [weight, setWeight] = React.useState<string>('');
  const ageRegex =
    /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
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
            }}>
            신체 정보를 알려주세요.
          </Headline>
        </View>
        <View style={style.textInputBox}>
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="나이"
            placeholder="ex) 19960624"
            keyboardType="numeric"
            value={age}
            error={ageRegex.test(age) ? false : true}
            onChangeText={value => setAge(value)}
          />
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="키"
            keyboardType="numeric"
            value={height}
            right={<TextInput.Affix text="cm" />}
            onChangeText={value => setHeight(value)}
          />
          <TextInput
            style={style.textInput}
            mode="outlined"
            label="몸무게"
            keyboardType="numeric"
            right={<TextInput.Affix text="kg" />}
            value={weight}
            onChangeText={value => setWeight(value)}
          />
        </View>
        <View style={style.buttonBox}>
          <Button
            mode="contained"
            disabled={
              ageRegex.test(age) === false ||
              height.length === 0 ||
              weight.length === 0
            }
            onPress={() => {
              save('age', age);
              save('height', height);
              save('weight', weight);
              navigation.navigate('WorkoutTimePeriod');
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
    margin: '5%',
    justifyContent: 'flex-end',
  },
  textInputBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'flex-start',
    margin: '5%',
  },
  textInput: {
    margin: '1%',
  },
  buttonBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'flex-start',
    margin: '5%',
  },
});
