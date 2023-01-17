import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Headline, Text, useTheme } from 'react-native-paper';

export default function SplashScreen() {
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
          운동 파트너 찾을 땐
        </Text>
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
