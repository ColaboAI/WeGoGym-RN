import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import { save } from '@store/secureStore';

import { AuthStackScreenProps } from 'navigators/types';
import { checkUsername } from '/api/api';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
type Props = AuthStackScreenProps<'Username'>;
export default function UsernameScreen({ navigation }: Props) {
  const theme = useTheme();
  const [username, setUsername] = React.useState<string>('');
  const { onShow } = useSnackBarActions();
  const handlePress = React.useCallback(async () => {
    save('username', username);
    const isUsernameExist = await checkUsername(username);
    if (isUsernameExist) {
      onShow('이미 존재하는 닉네임입니다.', 'error');
      return;
    } else {
      navigation.navigate('Gender');
    }
  }, [navigation, onShow, username]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <SafeAreaView style={style.container}>
        <View style={style.headlineBox}>
          <Headline
            style={{
              color: theme.colors.secondary,
              fontWeight: 'bold',
              fontSize: 24,
            }}>
            저희가 어떻게 불러드리면 될까요?
          </Headline>
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
            onPress={handlePress}>
            확인
          </Button>
        </View>
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
    justifyContent: 'flex-end',
  },
  textInputBox: {
    flex: 1,
    width: '90%',
    justifyContent: 'flex-start',
    margin: '5%',
  },
  buttonBox: {
    flex: 3,
    width: '90%',
    justifyContent: 'flex-start',
    margin: '5%',
  },
});
