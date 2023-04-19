import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Headline,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { save } from '@store/secureStore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthStackScreenProps } from 'navigators/types';
import CustomToolbar from 'components/organisms/CustomToolbar';
import { checkPhoneNumber } from '/api/api';

type Props = AuthStackScreenProps<'PhoneNumberRegister'>;

export default function PhoneNumberScreen({ navigation }: Props) {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [phoneNumberButtonReady, setPhoneNumberButtonReady] =
    React.useState<boolean>(false);
  const [codeButtonReady, setCodeButtonReady] = React.useState<boolean>(false);
  const [confirm, setConfirm] =
    React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [isButtonClicked, setIsButtonClicked] = React.useState<boolean>(false);

  const [isAgreedToS, setIsAgreedToS] = React.useState<boolean>(false);
  const [isAgreedPP, setIsAgreedPP] = React.useState<boolean>(false);

  const [isLoadingSendSMS, setIsLoadingSendSMS] =
    React.useState<boolean>(false);
  // Handle login
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      Alert.alert('인증이 완료되었습니다.');
      navigation.navigate('Username');
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      unsubscribe();
    }; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clean up
  useEffect(() => {
    return () => {
      setPhoneNumber('');
      setCode('');
      setPhoneNumberButtonReady(false);
      setCodeButtonReady(false);
      setConfirm(null);
      setIsButtonClicked(false);
      setIsAgreedToS(false);
      setIsAgreedPP(false);
    };
  }, []);

  async function signInWithPhoneNumber(_phoneNumber: string) {
    setIsLoadingSendSMS(true);
    save('phoneNumber', phoneNumber);

    const isPhoneNumberExist = await checkPhoneNumber(_phoneNumber);
    if (isPhoneNumberExist) {
      Alert.alert('이미 가입된 휴대폰 번호입니다. 로그인 페이지로 이동합니다.');
      navigation.replace('PhoneNumberLogin');
      setIsLoadingSendSMS(false);
      return;
    }
    const fbAuth = auth();
    try {
      const confirmation = await fbAuth.signInWithPhoneNumber(
        '+82' + _phoneNumber,
      );
      setConfirm(confirmation);
    } catch (error) {
      const err = error as FirebaseAuthTypes.NativeFirebaseAuthError;
      if (err.code === 'auth/invalid-phone-number') {
        Alert.alert('잘못된 휴대폰 번호입니다.', err.message);
        setIsButtonClicked(false);
      } else {
        Alert.alert('오류가 발생했습니다.', err.message);
        setIsButtonClicked(false);
      }
    } finally {
      setIsLoadingSendSMS(false);
    }
  }

  async function confirmCode() {
    setIsButtonClicked(true);
    try {
      if (confirm === null) {
        return;
      }
      await confirm.confirm(code);
      Alert.alert('인증이 완료되었습니다.');
      navigation.navigate('Username');
    } catch (error) {
      const err = error as FirebaseAuthTypes.NativeFirebaseAuthError;
      Alert.alert('인증 번호가 일치하지 않습니다.', err.message);
      setIsButtonClicked(false);
      setCodeButtonReady(false);
      setCode('');
    }
  }

  const phoneNumberButtonChange = useCallback((text: string) => {
    setPhoneNumber(text);
    if (text.length < 11) {
      setPhoneNumberButtonReady(false);
    } else if (text.length === 11) {
      setPhoneNumberButtonReady(true);
    }
  }, []);

  const codeButtonChange = (text: string) => {
    setCode(text);
    if (text.length < 6) {
      setCodeButtonReady(false);
    } else if (text.length === 6) {
      setCodeButtonReady(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        {confirm === null ? (
          <>
            <View style={style.headlineBox}>
              <Headline
                style={{
                  color: theme.colors.secondary,
                  fontWeight: 'bold',
                  fontSize: 24,
                }}>
                휴대폰 번호를 입력해주세요.
              </Headline>
              <Text style={{ color: theme.colors.outline, fontWeight: 'bold' }}>
                본인 인증을 위해 필요합니다.
              </Text>
            </View>
            <View style={style.listContainer}>
              <List.Section
                title="이용약관 및 개인정보 처리방침"
                titleStyle={{ fontWeight: 'bold' }}>
                <List.Item
                  style={style.listItem}
                  title="(필수)서비스 이용약관 동의하기"
                  left={() => (
                    <Checkbox.Item
                      label=""
                      status={isAgreedToS ? 'checked' : 'unchecked'}
                    />
                  )}
                  right={() => (
                    <IconButton
                      icon="document-text-outline"
                      onPress={() =>
                        Linking.openURL(
                          'https://colaboai.notion.site/40c14ec8e23f4a37b12d888b1ea69016',
                        )
                      }
                    />
                  )}
                  onPress={() => setIsAgreedToS(!isAgreedToS)}
                />
                <List.Item
                  style={style.listItem}
                  title="(필수)개인정보 처리방침 동의하기"
                  left={() => (
                    <Checkbox.Item
                      label=""
                      status={isAgreedPP ? 'checked' : 'unchecked'}
                    />
                  )}
                  right={() => (
                    <IconButton
                      icon="document-text-outline"
                      onPress={() =>
                        Linking.openURL(
                          'https://colaboai.notion.site/4e4707c4fa45400bac7d206684a9906f',
                        )
                      }
                    />
                  )}
                  onPress={() => setIsAgreedPP(!isAgreedPP)}
                />
              </List.Section>
            </View>

            <View style={style.textInputBox}>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                // TODO: when international phone number is supported, change 11 to 13
                error={phoneNumber.length > 11 ? true : false}
                label="휴대폰 번호"
                value={phoneNumber}
                placeholder="ex) 01012345678"
                onChangeText={value => phoneNumberButtonChange(value)}
                inputAccessoryViewID="authSMSsendButton"
              />
            </View>
            <CustomToolbar nativeID="authSMSsendButton">
              <View style={style.buttonBox}>
                <Button
                  mode="contained"
                  loading={isLoadingSendSMS}
                  disabled={
                    phoneNumberButtonReady && isAgreedPP && isAgreedToS
                      ? false
                      : true
                  }
                  onPress={() => {
                    signInWithPhoneNumber(phoneNumber);
                  }}>
                  동의 후 인증 번호 전송
                </Button>
              </View>
            </CustomToolbar>
          </>
        ) : (
          <>
            <View style={style.headlineBox}>
              <Headline
                style={{
                  color: theme.colors.secondary,
                  fontWeight: 'bold',
                  fontSize: 24,
                }}>
                인증 번호를 입력해주세요.
              </Headline>
            </View>
            <View style={style.textInputBox}>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                error={code.length > 6 ? true : false}
                label="인증 번호 6자리"
                value={code}
                onChangeText={value => codeButtonChange(value)}
                inputAccessoryViewID="typeAuthCodeButton"
                placeholder="ex) 123456"
              />
            </View>
            <CustomToolbar nativeID="typeAuthCodeButton">
              <View style={style.buttonBox}>
                <Button
                  mode="contained"
                  loading={!isButtonClicked ? false : true}
                  disabled={codeButtonReady ? false : true}
                  onPress={() => {
                    confirmCode();
                  }}>
                  코드 인증
                </Button>
              </View>
            </CustomToolbar>
          </>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  textInputBox: {
    flexShrink: 1,
    width: '90%',
    justifyContent: 'flex-start',
    margin: '5%',
  },
  buttonBox: {
    flex: 1,
    justifySelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? '5%' : '0%',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
  },
  listContainer: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  listItem: {
    margin: 0,
  },
});
