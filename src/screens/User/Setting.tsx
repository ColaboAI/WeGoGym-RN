import { StyleSheet, ScrollView, View, Linking, Alert } from 'react-native';
import { List, Switch } from 'react-native-paper';
import React, { useContext } from 'react';
import { AuthContext } from '@/App';

export default function SettingScreen() {
  const { signOut } = useContext(AuthContext);

  const [isPushAlarmSwitchOn, setIsPushAlarmSwitchOn] = React.useState(false);
  const [isMarketingSwitchOn, setIsMarketingSwitchOn] = React.useState(false);

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
        onPress: () => {
          signOut();
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
        onPress: () => {
          signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={style.container}>
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
        </View>
      </List.Section>
      <List.Section>
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
      </List.Section>
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
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    margin: '2%',
  },
});