import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import { List, Switch, Text } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useAuthActions, useAuthValue } from 'hooks/context/useAuth';

export default function SettingScreen() {
  const authState = useAuthValue();
  const { unRegister, signOut, getPhoneNumFromStorage } = useAuthActions();

  useEffect(() => {
    async function getPhoneNumber() {
      await getPhoneNumFromStorage();
    }
    getPhoneNumber();
  }, [getPhoneNumFromStorage]);

  const [isPushAlarmSwitchOn, setIsPushAlarmSwitchOn] = useState(false);
  const [isMarketingSwitchOn, setIsMarketingSwitchOn] = useState(false);

  const onTogglePushAlarmSwitch = () =>
    setIsPushAlarmSwitchOn(!isPushAlarmSwitchOn);

  const onToggleMarketingSwitch = () =>
    setIsMarketingSwitchOn(!isMarketingSwitchOn);

  const onSignOut = () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          await signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  const onDelete = () => {
    Alert.alert('정말로 회원탈퇴 하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          await unRegister();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>내 계정</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="전화번호"
              right={props => <Text {...props}>{authState.phoneNumber}</Text>}
            />
          </View>
        </List.Section>
        <List.Section>
          <List.Subheader>커뮤니티</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="디스코드"
              onPress={() => Linking.openURL('https://discord.gg/PCQEujn2')}
            />
            <List.Item
              title="인스타그램"
              onPress={() =>
                Linking.openURL('https://www.instagram.com/wegogym.official/')
              }
            />
            {/* TODO: voc Item 넣기 */}
          </View>
        </List.Section>
        <List.Section>
          <List.Subheader>약관 및 정책</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="이용약관"
              onPress={() =>
                Linking.openURL(
                  'https://colaboai.notion.site/40c14ec8e23f4a37b12d888b1ea69016',
                )
              }
            />
            <List.Item
              title="개인정보 처리방침"
              onPress={() =>
                Linking.openURL(
                  'https://colaboai.notion.site/4e4707c4fa45400bac7d206684a9906f',
                )
              }
            />
            <List.Item
              title="고객센터"
              onPress={() =>
                Alert.alert('아래 메일로 문의해주세요', 'colaboai@gmail.com')
              }
            />
          </View>
        </List.Section>
        {/* <List.Section>
          <List.Subheader>앱 설정</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="앱 푸시 알림"
              right={() => (
                <Switch
                  value={isPushAlarmSwitchOn}
                  onValueChange={onTogglePushAlarmSwitch}
                />
              )}
            />
            <List.Item
              title="마케팅, 광고성 정보 알림"
              right={() => (
                <Switch
                  value={isMarketingSwitchOn}
                  onValueChange={onToggleMarketingSwitch}
                />
              )}
            />
          </View>
        </List.Section> */}
        <List.Section>
          <List.Subheader>계정 관리</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="로그아웃"
              onPress={() => {
                onSignOut();
              }}
            />
            <List.Item
              title="회원 탈퇴"
              onPress={() => {
                onDelete();
              }}
            />
          </View>
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    margin: '1%',
  },
});
