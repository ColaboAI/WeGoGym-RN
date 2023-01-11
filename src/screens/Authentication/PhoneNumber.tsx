import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { save } from '../../store/SecureStoreService';
import auth from '@react-native-firebase/auth';

export default function PhoneNumberScreen({ navigation }: any) {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [phoneNumberButtonReady, setPhoneNumberButtonReady] =
    React.useState<boolean>(false);
  const [codeButtonReady, setCodeButtonReady] = React.useState<boolean>(false);
  const [confirm, setConfirm] = React.useState<any>(null);

  async function signInWithPhoneNumber(_phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(_phoneNumber);
    console.log(confirmation.confirm);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      navigation.navigate('Nickname');
    } catch (error) {
      Alert.alert('인증 번호가 일치하지 않습니다.');
    }
  }

  const phoneNumberButtonChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length < 11) {
      setPhoneNumberButtonReady(false);
    } else if (text.length === 11) {
      setPhoneNumberButtonReady(true);
    }
  };

  const codeButtonChange = (text: string) => {
    setCode(text);
    if (text.length < 6) {
      setCodeButtonReady(false);
    } else if (text.length === 6) {
      setCodeButtonReady(true);
    }
  };

  if (!confirm) {
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
              error={phoneNumber.length > 11 ? true : false}
              label="휴대폰 번호"
              value={phoneNumber}
              onChangeText={value => phoneNumberButtonChange(value)}
            />
          </View>
          <View style={style.buttonBox}>
            <Button
              mode="contained"
              disabled={phoneNumberButtonReady ? false : true}
              onPress={() => {
                save('phone_number', phoneNumber);
                // console.log('+82 ' + phoneNumber.slice(1));
                signInWithPhoneNumber('+82' + phoneNumber);
                // navigation.navigate('VerifyCode');
              }}>
              인증 번호 전송
            </Button>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
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
            인증 번호를 입력해주세요.
          </Headline>
          <Text style={{ color: theme.colors.outline, fontWeight: 'bold' }}>
            본인 인증을 위해 필요합니다.
          </Text>
        </View>
        <View style={style.textInputBox}>
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            error={code.length > 6 ? true : false}
            label="인증 번호 6자리"
            value={code}
            onChangeText={value => codeButtonChange(value)}
          />
        </View>
        <View style={style.buttonBox}>
          <Button
            mode="contained"
            disabled={codeButtonReady ? false : true}
            onPress={() => {
              confirmCode();
            }}>
            코드 인증
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
  buttonBox: {
    width: '90%',
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
});