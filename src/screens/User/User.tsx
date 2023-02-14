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
  Headline,
} from 'react-native-paper';

import React, { Suspense, useState } from 'react';
import { useGetMyInfoQuery } from 'hooks/queries/user.queries';
import GymInfoLoader from 'components/molecules/Home/GymInfoLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { UserStackScreenProps } from '/navigators/types';
type Props = UserStackScreenProps<'User'>;
export default function UserScreen({ navigation }: Props) {
  const theme = useTheme();
  const [isAuthenticated] = useState(true);
  const { data } = useGetMyInfoQuery();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Suspense fallback={<GymInfoLoader />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Headline>
            There was an error!
            <Button onPress={() => resetErrorBoundary()}>Try again</Button>
          </Headline>
        )}>
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
          <View style={style.profileContainer}>
            <View style={style.avatarContainer}>
              {data && data.profilePic ? (
                <Avatar.Image
                  size={64}
                  source={{ uri: data?.profilePic }}
                  style={style.avatar}
                />
              ) : (
                <Avatar.Text
                  size={64}
                  label={data?.username[0] ?? 'User'}
                  // style={style.avatar}
                />
              )}
            </View>
            <View style={style.usernameContainer}>
              <Text variant="titleMedium">{data?.username} 님</Text>
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
            <Button
              onPress={() => {
                if (data) {
                  navigation.navigate('ProfileEdit', {
                    myInfo: data,
                  });
                } else {
                  throw new Error('MyInfoData is undefined');
                }
              }}>
              프로필 편집
            </Button>
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
                    {data?.height}cm
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
                    {data?.weight}kg
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
                    {/* 괄호 앞만 사용 */}
                    {data?.workoutLevel.split('(')[0]}
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
                    {data?.age}세
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
                        {data?.address ?? '동네를 등록하고 친구를 찾아보세요!'}
                      </Text>
                    )}
                  />
                  <List.Item
                    title="헬스장"
                    right={() => (
                      <Text variant="bodySmall">
                        {data?.gym ?? '어떤 헬스장을 다니시나요?'}
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
      </ErrorBoundary>
    </Suspense>
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
