import { View, Text } from 'react-native';
import React from 'react';
import { useTheme, Button } from 'react-native-paper';

function Home({ navigation }: any) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}>
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

export default Home;
