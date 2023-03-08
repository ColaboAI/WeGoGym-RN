import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { getValueFor } from '/store/secureStore';
import { getRelativeTime } from '/utils/util';
import CustomAvatar from '/components/atoms/Common/CustomAvatar';
type Props = {
  getUserInfo: (id: string) => User | undefined;
} & Message;
const Bubble = ({ text, createdAt, userId, getUserInfo }: Props) => {
  const theme = useTheme();

  const myId = getValueFor('userId');

  const isLeft = myId !== userId;
  const userInfo = getUserInfo(userId);

  return (
    <View style={styles.bubbleContainer}>
      {isLeft && (
        <View style={styles.avatarContainer}>
          <CustomAvatar
            username={userInfo?.username ?? '알 수 없음'}
            profilePic={userInfo?.profilePic}
            size={30}
            style={styles.avatar}
          />
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[
              {
                color: theme.colors.onBackground,
              },
              styles.userName,
            ]}>
            {userInfo?.username ?? '알 수 없음'}
          </Text>
        </View>
      )}
      <Surface
        style={[
          isLeft ? styles.leftBubble : styles.rightBubble,
          {
            backgroundColor: isLeft
              ? theme.colors.secondary
              : theme.colors.primary,
          },
        ]}
        elevation={3}>
        <Text
          style={{
            color: isLeft ? theme.colors.onSecondary : theme.colors.onPrimary,
          }}>
          {text}
        </Text>
        <Text
          style={{
            color: isLeft ? theme.colors.onSecondary : theme.colors.onPrimary,
          }}>
          {getRelativeTime(createdAt)}
        </Text>
      </Surface>
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginRight: 60,
    padding: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },

  rightBubble: {
    alignSelf: 'flex-end',
    marginLeft: 60,
    marginRight: 10,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },

  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: '1%',
  },

  userName: {
    textAlignVertical: 'center',
    fontWeight: '600',
    marginLeft: '1%',
  },
  avatar: {
    alignSelf: 'center',
  },
});
