import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {
  IconButton,
  Text,
  Avatar,
  Divider,
  Card,
  List,
  useTheme,
  Tooltip,
  Button,
} from 'react-native-paper';
import React, { useState } from 'react';
import { UserStackScreenProps } from '/navigators/types';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
type Props = UserStackScreenProps<'ProfileEdit'>;

export default function ProfileEdit({ navigation, route }: Props) {
  const theme = useTheme();
  const [isAuthenticated] = useState(true);
  const myInfo = route.params.myInfo;
  const onPressProfilePic = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'popover',
      selectionLimit: 1,
    };

    const res = await launchImageLibrary(options);
    console.log(res);
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <IconButton
          icon="settings-outline"
          onPress={() => {
            navigation.navigate('Setting');
          }}
        />
      </View>
      <Divider />
      {/* Profile picture upload */}
      <View style={style.profileContainer}>
        <View style={style.avatarContainer}>
          {myInfo.profilePic ? (
            <Avatar.Image
              size={64}
              source={{ uri: myInfo.profilePic }}
              style={style.avatar}
            />
          ) : (
            <Avatar.Text size={64} label={myInfo.username[0] ?? 'User'} />
          )}
        </View>
        <View style={style.usernameContainer}>
          <Text variant="titleMedium">{myInfo.username} 님</Text>
          {isAuthenticated ? (
            <Tooltip
              title="프로필 인증이 완료된 회원입니다."
              enterTouchDelay={100}>
              <IconButton
                icon="checkmark-circle-outline"
                iconColor="green"
                size={18}
                style={style.icon}
              />
            </Tooltip>
          ) : null}
        </View>
        <Button onPress={onPressProfilePic}>프로필 사진 수정</Button>
      </View>
      <ScrollView>
        <View style={style.title}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.primary,
            }}>
            🏋🏻 나의 피지컬
          </Text>
        </View>
        <View style={style.physicalContainer}>
          <Card>
            <Card.Content style={style.card}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.primary,
                }}>
                {myInfo.height}cm
              </Text>
              <Text variant="bodySmall">키</Text>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content style={style.card}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.primary,
                }}>
                {myInfo.weight}kg
              </Text>
              <Text variant="bodySmall">몸무게</Text>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content style={style.card}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.primary,
                }}>
                {myInfo.workoutLevel.split('(')[0]}
              </Text>
              <Text variant="bodySmall">운동 경력</Text>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content style={style.card}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.primary,
                }}>
                {myInfo.age}세
              </Text>
              <Text variant="bodySmall">나이</Text>
            </Card.Content>
          </Card>
        </View>
        <View style={style.title}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.primary,
            }}>
            ℹ️ 나의 정보
          </Text>
        </View>
        <View style={style.infoContainer}>
          <Card>
            <Card.Content>
              <List.Item
                title="동네"
                right={() => (
                  <Text variant="bodySmall">
                    {myInfo.address ?? '동네를 등록하고 친구를 찾아보세요!'}
                  </Text>
                )}
              />
              <List.Item
                title="헬스장"
                right={() => (
                  <Text variant="bodySmall">
                    {myInfo.gym ?? '어떤 헬스장을 다니시나요?'}
                  </Text>
                )}
              />
              <List.Item
                title="출석률"
                right={() => <Text variant="bodySmall">80%</Text>}
              />
              <List.Item
                title="운동 약속"
                right={() => <Text variant="bodySmall">??회</Text>}
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  usernameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: -40,
    top: -22,
  },
  title: {
    paddingLeft: 12,
  },
  physicalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  infoContainer: {
    padding: 12,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 85,
    height: 80,
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
