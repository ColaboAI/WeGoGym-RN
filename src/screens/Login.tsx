import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Button, Headline, Text, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from '@/navigators/types';

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
          onPress={() => navigation.navigate('PhoneNumber')}>
          전화 번호로 시작하기
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
  imageBox: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonBox: {
    width: '80%',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
});
