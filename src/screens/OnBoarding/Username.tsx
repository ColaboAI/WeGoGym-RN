import { StyleSheet, View, SafeAreaView } from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { save } from '../../store/SecureStoreService';

export default function UsernameScreen({ navigation }: any) {
  const theme = useTheme();
  const [username, setUsername] = React.useState<string>('');

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
          저희가 어떻게 불러드리면 될까요?
        </Headline>
        <Text style={{ color: theme.colors.outline, fontWeight: 'bold' }}>
          닉네임을 입력해주세요.
        </Text>
      </View>
      <View style={style.textInputBox}>
        <TextInput
          mode="outlined"
          label="닉네임"
          value={username}
          onChangeText={value => setUsername(value)}
        />
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={username.length < 1}
          onPress={() => {
            save('username', username);
            navigation.navigate('Gender');
          }}>
          확인
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
