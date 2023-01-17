import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import React from 'react';

export default function UserScreen({ navigation }: any) {
  return (
    <View style={style.container}>
      <Button
        onPress={() => {
          navigation.navigate('Setting');
        }}>
        설정
      </Button>
      <Text>User Screen</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
