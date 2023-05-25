import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {
  Button,
  Headline,
  TextInput,
  useTheme,
  Text,
} from 'react-native-paper';
import { save } from '@store/secureStore';

import { AuthStackScreenProps } from 'navigators/types';
import { checkUsername } from '/api/api';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import CustomToolbar from '/components/organisms/CustomToolbar';
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <SafeAreaView style={style.container}>
          <Text style={[style.helperTextBox, { color: theme.colors.outline }]}>
            프로필을 완성하기 위해 몇 가지만 여쭤볼게요. 잠깐이면 됩니다!
          </Text>
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
              inputAccessoryViewID="usernameConfirmBtn"
              onChangeText={value => setUsername(value)}
            />
          </View>
          <CustomToolbar nativeID="usernameConfirmBtn">
            <View style={style.buttonBox}>
              <Button
                mode="contained"
                disabled={username.length < 1}
                onPress={handlePress}>
                확인
              </Button>
            </View>
          </CustomToolbar>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  helperTextBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: '5%',
  },
  headlineBox: {
    flex: 1,
    margin: '5%',
    justifyContent: 'center',
  },
  textInputBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  buttonBox: {
    flex: 1,
    width: '90%',
    justifySelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? '5%' : '0%',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
  },
});
