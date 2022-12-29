import { StyleSheet, View } from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function RegisterScreen() {
  const theme = useTheme();
  const [input, setInput] = React.useState<string>('');
  const [buttonReady, setButtonReady] = React.useState<boolean>(false);
  // If null, no SMS has been sent
  // const [confirm, setConfirm] = React.useState(null);

  async function signInWithPhoneNumber(phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log(confirmation);
    // setConfirm(confirmation);
  }

  const ButtonChange = (text: string) => {
    setInput(text);
    if (text.length < 11) {
      setButtonReady(false);
    } else if (text.length === 11) {
      setButtonReady(true);
    }
  };

  return (
    <View style={style.container}>
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
          keyboardType="number-pad"
          label="휴대폰 번호"
          value={input}
          onChangeText={value => ButtonChange(value)}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={buttonReady ? false : true}
          onPress={() => signInWithPhoneNumber('+82 10-4409-5071')}>
          확인
        </Button>
      </View>
    </View>
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
