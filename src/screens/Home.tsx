import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme, Button } from 'react-native-paper';

function Home({ navigation }: any) {
  const theme = useTheme();
  return (
    <View style={style.container}>
      <Text style={{ color: theme.colors.onBackground }}>Home Screen</Text>
      <Button
        mode={'elevated'}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
        onLongPress={() => console.warn('long press')}
        onPress={() => navigation.navigate('Details')}>
        Jump to Detail Screen
      </Button>
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
export default Home;
