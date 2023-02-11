import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import React, { useCallback } from 'react';
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
import auth from '@react-native-firebase/auth';
import { AuthStackScreenProps } from '@/navigators/types';
import CustomToolbar from '@/component/organisms/CustomToolbar';

type Props = AuthStackScreenProps<'PhoneNumberRegister'>;

export default function PhoneNumberScreen({ navigation }: Props) {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [phoneNumberButtonReady, setPhoneNumberButtonReady] =
    React.useState<boolean>(false);
  const [codeButtonReady, setCodeButtonReady] = React.useState<boolean>(false);
  const [confirm, setConfirm] = React.useState<any>(null);
  const [isButtonClicked, setIsButtonClicked] = React.useState<boolean>(false);

  const [isAgreedToS, setIsAgreedToS] = React.useState<boolean>(false);
  const [isAgreedPP, setIsAgreedPP] = React.useState<boolean>(false);

  async function signInWithPhoneNumber(_phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(
      '+82' + _phoneNumber,
    );
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      navigation.navigate('Username');
    } catch (error) {
      Alert.alert('인증 번호가 일치하지 않습니다.');
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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <SafeAreaView style={style.container}>
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
                onChangeText={value => phoneNumberButtonChange(value)}
                inputAccessoryViewID="sendButton"
              />
            </View>
            <CustomToolbar nativeID="sendButton">
              <View style={style.buttonBox}>
                <Button
                  mode="contained"
                  disabled={
                    phoneNumberButtonReady && isAgreedPP && isAgreedToS
                      ? false
                      : true
                  }
                  onPress={() => {
                    save('phoneNumber', phoneNumber);
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
                inputAccessoryViewID="typeCodeButton"
              />
            </View>
            <CustomToolbar nativeID="typeCodeButton">
              <View style={style.buttonBox}>
                <Button
                  mode="contained"
                  loading={!isButtonClicked ? false : true}
                  disabled={codeButtonReady ? false : true}
                  onPress={() => {
                    setIsButtonClicked(true);
                    confirmCode();
                  }}>
                  코드 인증
                </Button>
              </View>
            </CustomToolbar>
          </>
        )}
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
    justifyContent: 'center',
  },
  textInputBox: {
    flex: 3,
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
