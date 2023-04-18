import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import { IconButton, List, Text } from 'react-native-paper';
import React, { useCallback, useEffect } from 'react';
import { useAuthActions, useAuthValue } from 'hooks/context/useAuth';
import { useGetMyBlockedListQuery } from '/hooks/queries/user.queries';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
import { deleteBlockUser } from '/api/api';
import { AxiosError } from 'axios';
import { useSnackBarActions } from '/hooks/context/useSnackbar';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingScreen() {
  const authState = useAuthValue();
  const { unRegister, signOut, getPhoneNumFromStorage } = useAuthActions();
  const { onShow } = useSnackBarActions();
  const queryClient = useQueryClient();
  useEffect(() => {
    async function getPhoneNumber() {
      await getPhoneNumFromStorage();
    }
    getPhoneNumber();
  }, [getPhoneNumFromStorage]);

  // const [isPushAlarmSwitchOn, setIsPushAlarmSwitchOn] = useState(false);
  // const [isMarketingSwitchOn, setIsMarketingSwitchOn] = useState(false);

  // const onTogglePushAlarmSwitch = () =>
  //   setIsPushAlarmSwitchOn(!isPushAlarmSwitchOn);

  // const onToggleMarketingSwitch = () =>
  //   setIsMarketingSwitchOn(!isMarketingSwitchOn);

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

  const blockedListQuery = useGetMyBlockedListQuery();

  const unBlockUser = useCallback(
    async (user: RecommendedMate) => {
      try {
        await deleteBlockUser(user.id);
        blockedListQuery.refetch();
        queryClient.invalidateQueries(['chatList']);
        onShow(`${user.username}님을 차단 해제했습니다.`);
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.data) {
            Alert.alert(e.response.data.message);
          }
        } else {
          Alert.alert('차단 해제 실패');
        }
      }
    },
    [blockedListQuery, onShow, queryClient],
  );

  const renderUserAvatar = useCallback((user: RecommendedMate) => {
    return (
      <CustomAvatar
        size={30}
        key={user.id}
        username={user.username}
        profilePic={user.profilePic}
      />
    );
  }, []);

  const renderUserUnblockButton = useCallback(
    (user: RecommendedMate) => {
      return (
        <IconButton
          icon="remove-circle"
          onPress={() =>
            Alert.alert('차단 해제', '정말로 차단을 해제하시겠습니까?', [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: () => unBlockUser(user),
                style: 'destructive',
              },
            ])
          }
        />
      );
    },
    [unBlockUser],
  );

  const renderBlockedUserList = useCallback(() => {
    if (blockedListQuery.isLoading) {
      return <List.Item title="로딩 중..." />;
    } else if (blockedListQuery.isError) {
      return <List.Item title="에러 발생" />;
    } else if (blockedListQuery.data?.length === 0) {
      return <List.Item title="차단한 유저가 없습니다." />;
    }
    return blockedListQuery.data?.map(user => (
      <List.Item
        key={user.id}
        title={user.username}
        left={() => renderUserAvatar(user)}
        right={() => renderUserUnblockButton(user)}
        style={style.listItem}
      />
    ));
  }, [
    blockedListQuery.data,
    blockedListQuery.isError,
    blockedListQuery.isLoading,
    renderUserAvatar,
    renderUserUnblockButton,
  ]);

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
            <List.Accordion title="차단 목록">
              {renderBlockedUserList()}
            </List.Accordion>
          </View>
        </List.Section>
        <List.Section>
          <List.Subheader>앱 이용</List.Subheader>
          <View style={style.listContainer}>
            <List.Item
              title="안내 및 공지사항"
              onPress={() =>
                Linking.openURL(
                  'https://colaboai.notion.site/WeGoGym-cf3200d73cee4f64b917a99b18f0634c',
                )
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
  listItem: {
    marginLeft: '5%',
  },
});
