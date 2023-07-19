import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button, Headline, Text, useTheme } from 'react-native-paper';
import { AuthStackScreenProps } from 'navigators/types';
type Props = AuthStackScreenProps<'Welcome'>;
export default function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  return (
    <View style={style.container}>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.primary,
            fontWeight: 'bold',
            fontSize: 32,
          }}>
          WeGoGym
        </Headline>
        <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
          운동 친구 찾을 땐
        </Text>
      </View>
      <View style={style.buttonBox}>
        <Button mode="contained" onPress={() => navigation.navigate('Login')}>
          시작하기
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBox: {
    width: '80%',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
});
