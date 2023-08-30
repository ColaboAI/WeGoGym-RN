import { StyleSheet, View, SafeAreaView, Platform, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import {
  Button,
  Headline,
  useTheme,
  Text,
  IconButton,
} from 'react-native-paper';
import { getValueFor } from '@store/secureStore';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { getInfo } from '/utils/util';
import { useAuthActions } from '/hooks/context/useAuth';

export default function ProfileImageScreen() {
  const theme = useTheme();
  const [profileImage, setProfileImage] = useState<string>('');
  const username = getValueFor('username') ?? '';
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const { signUp } = useAuthActions();

  const makeImageUri = useCallback((uri: string): string => {
    return Platform.OS === 'android' ? uri : uri.replace('file://', '');
  }, []);

  const onPressProfilePic = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'popover',
      selectionLimit: 1,
      quality: 0.1,
    };
    const res = await launchImageLibrary(options);
    if (res.didCancel) {
      console.log('User cancelled image picker');
    } else if (res.errorCode) {
      throw new Error(res.errorMessage);
    } else {
      if (res.assets && res.assets.length > 0 && res.assets[0].uri) {
        const uri = makeImageUri(res.assets[0].uri);
        setSelectedImage(res.assets[0]);
        setProfileImage(uri);
      }
    }
  }, [makeImageUri]);

  const onRegisterButtonClicked = useCallback(async () => {
    const data = new FormData();
    if (selectedImage) {
      data.append('file', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });
    }
    const info = getInfo();
    if (info) {
      signUp(info, data);
    } else {
      Alert.alert('회원가입에 실패했습니다.');
    }
  }, [selectedImage, signUp]);

  return (
    <SafeAreaView style={style.container}>
      <Text style={[style.helperTextBox, { color: theme.colors.outline }]}>
        마지막이에요!
      </Text>
      <View style={style.headlineBox}>
        <Headline
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          프로필 사진을 등록해주세요.
        </Headline>
        <Text style={[style.textBox, { color: theme.colors.outline }]}>
          사진을 등록하면 운동 친구를 더 쉽게 찾을 수 있어요.
        </Text>
      </View>
      <View style={style.profileImageBox}>
        <View style={style.avatarBox}>
          <CustomAvatar
            username={username}
            profilePic={profileImage}
            size={150}
          />
          <View
            style={[
              style.cameraIconBox,
              {
                backgroundColor: theme.colors.tertiary,
              },
            ]}>
            <IconButton
              icon="camera"
              iconColor={theme.colors.onTertiary}
              size={25}
              onPress={onPressProfilePic}
            />
          </View>
        </View>
        <View style={style.usernameBox}>
          <Text variant="titleMedium"> {username} 님</Text>
        </View>
      </View>
      <View style={style.buttonBox}>
        <Button
          mode="contained"
          disabled={!profileImage}
          onPress={onRegisterButtonClicked}>
          확인
        </Button>
        <Button
          style={style.button}
          mode="contained-tonal"
          onPress={onRegisterButtonClicked}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            나중에 등록하기
          </Text>
        </Button>
      </View>
    </SafeAreaView>
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
  },
  textBox: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileImageBox: {
    flex: 2,
    width: '90%',
    justifyContent: 'center',
    margin: '5%',
  },
  avatarBox: {
    margin: '3%',
  },
  usernameBox: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10%',
  },
  cameraIconBox: {
    position: 'absolute',
    bottom: 0,
    right: '27%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  button: {
    marginVertical: '2%',
  },
  buttonBox: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
  },
});
