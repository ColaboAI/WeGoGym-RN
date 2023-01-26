import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import {
  IconButton,
  Text,
  Avatar,
  Divider,
  Card,
  List,
  useTheme,
} from 'react-native-paper';
import * as React from 'react';

export default function UserScreen({ navigation }: any) {
  const theme = useTheme();
  const [isAuthenticated] = React.useState(true);
  const data = [
    {
      id: 0,
      title: 'username',
      value: '스근하이',
    },
    {
      id: 1,
      title: 'uri',
      value: 'https://i.ibb.co/Y725W4C/image.png',
    },
    {
      id: 2,
      title: 'height',
      value: '174',
    },
    {
      id: 3,
      title: 'weight',
      value: '73',
    },
    {
      id: 4,
      title: 'workout_level',
      value: '중급',
    },
    {
      id: 5,
      title: 'age',
      value: '25',
    },
    {
      id: 6,
      title: 'location',
      value: '서울시 관악구 서원동',
    },
    {
      id: 7,
      title: 'my_gym',
      value: '짐박스 봉천점',
    },
    {
      id: 8,
      title: 'appointed_number',
      value: '9',
    },
    {
      id: 9,
      title: 'present_number',
      value: '80',
    },
    {
      id: 10,
      title: 'workout_goal',
      value: ['다이어트', '근육증가', '체지방 감소'],
    },
  ];

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <IconButton
          icon="cog-outline"
          onPress={() => {
            navigation.navigate('Setting');
          }}
        />
      </View>
      <Divider />
      <View style={style.profileContainer}>
        <View style={style.avatarContainer}>
          <Avatar.Image
            size={64}
            source={{ uri: 'https://i.ibb.co/Y725W4C/image.png' }}
            style={style.avatar}
          />
        </View>
        <View style={style.usernameContainer}>
          <Text variant="titleMedium">{data[0].value} 님</Text>
          {isAuthenticated ? (
            <>
              <IconButton
                icon="check-circle-outline"
                iconColor="green"
                size={18}
                style={style.icon}
                onPress={() => console.log('Pressed')}
              />
            </>
          ) : null}
        </View>
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
                {data[2].value}cm
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
                {data[3].value}kg
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
                {data[4].value}
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
                {data[5].value}세
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
                right={() => <Text variant="bodySmall">{data[6].value}</Text>}
              />
              <List.Item
                title="헬스장"
                right={() => <Text variant="bodySmall">{data[7].value}</Text>}
              />
              <List.Item
                title="출석률"
                right={() => <Text variant="bodySmall">{data[9].value}%</Text>}
              />
              <List.Item
                title="운동 약속"
                right={() => <Text variant="bodySmall">{data[8].value}회</Text>}
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
