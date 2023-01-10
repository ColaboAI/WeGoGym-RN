import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function PhoneNumberScreen({ navigation }: any) {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [buttonReady, setButtonReady] = React.useState<boolean>(false);

  const ButtonChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length < 11) {
      setButtonReady(false);
    } else if (text.length === 11) {
      setButtonReady(true);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 24,
            // backgroundColor: '#000000',
          }}>
          휴대폰 번호를 입력해주세요.
        </Headline>
        <Text style={{ color: theme.colors.outline, fontWeight: 'bold' }}>
          본인 인증을 위해 필요합니다.
        </Text>
      </View>
      <View style={style.textInputBox}>
        <TextInput
          mode="outlined"
          keyboardType="numeric"
          label="휴대폰 번호"
          value={phoneNumber}
          onChangeText={value => ButtonChange(value)}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={buttonReady ? false : true}
          onPress={() => navigation.navigate('VerifyCode')}>
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
  textInputBox: {
    flex: 1,
    width: '90%',
    position: 'absolute',
    alignSelf: 'center',
    top: '25%',
  },
  buttonBox: {
    width: '90%',
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
});
