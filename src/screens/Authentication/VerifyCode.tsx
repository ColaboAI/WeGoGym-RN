import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
// import auth from '@react-native-firebase/auth';

export default function VerifyCodeScreen({ navigation }: any) {
  const theme = useTheme();
  const [code, setCode] = React.useState<string>('');
  const [buttonReady, setButtonReady] = React.useState<boolean>(false);
  // If null, no SMS has been sent
  // const [confirm, setConfirm] = React.useState(null);

  //   async function signInWithPhoneNumber(phoneNumber: string) {
  //     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  //     console.log(confirmation);
  //     setConfirm(confirmation);
  //   }

  const ButtonChange = (text: string) => {
    setCode(text);
    if (text.length < 6) {
      setButtonReady(false);
    } else if (text.length === 6) {
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
          label="인증 번호 6자리"
          value={code}
          onChangeText={value => ButtonChange(value)}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={buttonReady ? false : true}
          onPress={() => navigation.navigate('Nickname')}>
          코드 인증
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
