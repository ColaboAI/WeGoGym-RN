import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Button, Headline, Text, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from 'navigators/types';

type Props = AuthStackScreenProps<'Login'>;
export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  return (
    <View style={style.container}>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 28,
          }}>
          <Headline
            style={{
              color: theme.colors.primary,
              fontWeight: 'bold',
              fontSize: 28,
            }}>
            위고짐
          </Headline>
          에 오신 것을{'\n'}환영합니다!
        </Headline>
        <Text style={{ color: theme.colors.outline, fontWeight: 'bold' }}>
          3초 가입으로 바로 시작해보세요.
        </Text>
      </View>
      <View style={style.imageBox}>
        <Image
          style={{ height: 350, width: 350 }}
          resizeMode="contain"
          source={require('../image/gymmate.png')}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          icon="call-sharp"
          mode="contained"
          onPress={() => navigation.navigate('PhoneNumberRegister')}>
          가입하기
        </Button>
        <Button
          icon="call-sharp"
          mode="contained"
          onPress={() => navigation.navigate('PhoneNumberLogin')}>
          로그인
        </Button>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  headlineBox: {
    flex: 1,
    left: '5%',
    top: '5%',
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  imageBox: {
    flexGrow: 2,
    justifyContent: 'center',
  },
  buttonBox: {
    flex: 1,
    width: '80%',
    justifyContent: 'space-evenly',
    bottom: '5%',
  },
  button: { paddingVertical: 10 },
});
