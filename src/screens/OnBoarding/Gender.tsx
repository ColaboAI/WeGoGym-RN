import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Button, Headline, useTheme, Text } from 'react-native-paper';
import { save } from '@store/secureStore';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'Gender'>;

export default function GenderScreen({ navigation }: Props) {
  const theme = useTheme();
  const buttonText = ['🙍‍♂️ 남성', '🙍‍♀️ 여성', '그 외 성별'];
  const genders = ['male', 'female', 'other'];
  const [gender, setGender] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number>(-1);
  const getButton = (id: number) => {
    return (
      <Button
        style={[style.button]}
        mode={id === selectedId ? 'contained' : 'elevated'}
        onPress={() => {
          setGender(genders[id]);
          setSelectedId(id);
        }}>
        {buttonText[id]}
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
          성별이 어떻게 되시나요?
        </Headline>
      </View>
      <View style={style.genderBox}>
        <View style={style.genderButtonBox}>
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
  helperTextBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: '5%',
  },
  headlineBox: {
    flex: 1,
    margin: '5%',
  },
  genderBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  genderButtonBox: {
    margin: '3%',
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
