import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import React, { useCallback } from 'react';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import CustomToolbar from 'components/organisms/CustomToolbar';
import { useAuthActions } from 'hooks/context/useAuth';
import { getValueFor } from '/store/secureStore';
import { checkPhoneNumber } from '/api/api';
// type Props = AuthStackScreenProps<'PhoneNumberLogin'>;

export default function PhoneNumberScreen() {
  const theme = useTheme();
  const authActions = useAuthActions();

  const [phoneNumber, setPhoneNumber] = React.useState<string>(
    getValueFor('phoneNumber') || '',
  );

  const phoneNumberButtonChange = useCallback((text: string) => {
    setPhoneNumber(text);
  }, []);

  const isPhoneNumber = useCallback(() => {
    if (phoneNumber.length < 11 || phoneNumber.length > 11) {
      return false;
    } else if (phoneNumber.length === 11) {
      return true;
    }
  }, [phoneNumber.length]);

  const onPressLogin = useCallback(async () => {
    const isPhoneNumberExist = await checkPhoneNumber(phoneNumber);
    if (!isPhoneNumberExist) {
      Alert.alert('로그인 정보를 확인해주세요.');
      return;
    }
    try {
      await authActions.signIn(phoneNumber);
    } catch (error) {
      Alert.alert('오류가 발생했습니다.');
    }
  }, [authActions, phoneNumber]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <SafeAreaView style={style.container}>
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
                disabled={isPhoneNumber() ? false : true}
                onPress={onPressLogin}>
                로그인
              </Button>
            </View>
          </CustomToolbar>
        </>
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
    flex: 2,
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
